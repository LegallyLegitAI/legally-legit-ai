-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE business_structure AS ENUM (
  'sole_trader',
  'partnership',
  'company',
  'trust'
);

CREATE TYPE subscription_tier AS ENUM (
  'free',
  'pay_per_document',
  'basic',
  'pro'
);

CREATE TYPE subscription_status AS ENUM (
  'active',
  'cancelled',
  'past_due',
  'trialing',
  'incomplete',
  'incomplete_expired'
);

CREATE TYPE document_status AS ENUM (
  'draft',
  'generated',
  'preview',
  'purchased',
  'downloaded'
);

CREATE TYPE risk_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

CREATE TYPE obligation_status AS ENUM (
  'pending',
  'completed',
  'overdue',
  'cancelled'
);

CREATE TYPE email_sequence_status AS ENUM (
  'pending',
  'active',
  'completed',
  'unsubscribed'
);

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,
  marketing_consent BOOLEAN DEFAULT FALSE
);

-- Businesses table
CREATE TABLE public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  abn TEXT, -- Australian Business Number
  acn TEXT, -- Australian Company Number
  business_structure business_structure NOT NULL,
  industry TEXT,
  employee_count INTEGER DEFAULT 0,
  annual_revenue DECIMAL(12, 2),
  has_website BOOLEAN DEFAULT FALSE,
  website_url TEXT,
  handles_customer_data BOOLEAN DEFAULT FALSE,
  operates_internationally BOOLEAN DEFAULT FALSE,
  registered_state TEXT,
  business_address JSONB, -- Store as JSON for flexibility
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, business_name)
);

-- Risk assessments/quizzes table
CREATE TABLE public.risk_assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  risk_level risk_level,
  risk_areas JSONB, -- Detailed breakdown of risk by category
  completed_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ, -- Assessments should be refreshed periodically
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz questions table (for dynamic quiz management)
CREATE TABLE public.quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'single_choice', 'multiple_choice', 'text', 'number', 'boolean'
  category TEXT NOT NULL, -- 'business_structure', 'privacy', 'employment', etc.
  options JSONB, -- For choice questions
  weight INTEGER DEFAULT 1, -- Impact on risk score
  is_active BOOLEAN DEFAULT TRUE,
  order_position INTEGER,
  conditional_logic JSONB, -- Rules for showing/hiding based on previous answers
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz answers table
CREATE TABLE public.quiz_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES public.risk_assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.quiz_questions(id),
  answer_value JSONB NOT NULL, -- Flexible storage for different answer types
  risk_impact INTEGER DEFAULT 0, -- Calculated risk contribution
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assessment_id, question_id)
);

-- Document templates table
CREATE TABLE public.document_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'privacy', 'employment', 'terms', etc.
  risk_categories TEXT[], -- Which risk areas this document addresses
  base_price DECIMAL(10, 2),
  template_content JSONB, -- Structured template with placeholders
  required_fields JSONB, -- Fields needed for generation
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated documents table
CREATE TABLE public.generated_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.document_templates(id),
  assessment_id UUID REFERENCES public.risk_assessments(id),
  document_name TEXT NOT NULL,
  status document_status DEFAULT 'draft',
  form_data JSONB, -- User inputs from wizard
  generated_content TEXT, -- Final document content
  pdf_url TEXT, -- Supabase storage URL
  watermarked_pdf_url TEXT, -- Preview version URL
  version INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES public.generated_documents(id), -- For versioning
  generated_at TIMESTAMPTZ,
  purchased_at TIMESTAMPTZ,
  downloaded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  tier subscription_tier DEFAULT 'free',
  status subscription_status DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  monthly_document_limit INTEGER,
  documents_used_this_period INTEGER DEFAULT 0,
  metadata JSONB, -- Store additional Stripe data
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment transactions table
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  document_id UUID REFERENCES public.generated_documents(id),
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_invoice_id TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'AUD',
  status TEXT NOT NULL, -- 'pending', 'succeeded', 'failed', 'cancelled'
  payment_method TEXT,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compliance obligations table
CREATE TABLE public.compliance_obligations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  due_date DATE,
  frequency TEXT, -- 'once', 'annual', 'quarterly', 'monthly'
  status obligation_status DEFAULT 'pending',
  priority risk_level DEFAULT 'medium',
  reminder_sent BOOLEAN DEFAULT FALSE,
  reminder_date DATE,
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES public.users(id),
  related_document_id UUID REFERENCES public.generated_documents(id),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email sequences table
CREATE TABLE public.email_sequences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES public.risk_assessments(id),
  sequence_type TEXT NOT NULL, -- 'high_risk', 'medium_risk', 'low_risk', 'onboarding'
  status email_sequence_status DEFAULT 'pending',
  current_step INTEGER DEFAULT 0,
  total_steps INTEGER,
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Email logs table
CREATE TABLE public.email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sequence_id UUID REFERENCES public.email_sequences(id),
  email_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  resend_email_id TEXT, -- ID from Resend API
  status TEXT, -- 'sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed'
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table (for compliance record-keeping)
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  business_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX idx_risk_assessments_business_id ON public.risk_assessments(business_id);
CREATE INDEX idx_risk_assessments_user_id ON public.risk_assessments(user_id);
CREATE INDEX idx_quiz_answers_assessment_id ON public.quiz_answers(assessment_id);
CREATE INDEX idx_generated_documents_business_id ON public.generated_documents(business_id);
CREATE INDEX idx_generated_documents_user_id ON public.generated_documents(user_id);
CREATE INDEX idx_generated_documents_status ON public.generated_documents(status);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON public.subscriptions(stripe_customer_id);
CREATE INDEX idx_payment_transactions_user_id ON public.payment_transactions(user_id);
CREATE INDEX idx_compliance_obligations_business_id ON public.compliance_obligations(business_id);
CREATE INDEX idx_compliance_obligations_due_date ON public.compliance_obligations(due_date);
CREATE INDEX idx_email_sequences_user_id ON public.email_sequences(user_id);
CREATE INDEX idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_assessments_updated_at BEFORE UPDATE ON public.risk_assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quiz_questions_updated_at BEFORE UPDATE ON public.quiz_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at BEFORE UPDATE ON public.document_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_documents_updated_at BEFORE UPDATE ON public.generated_documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_transactions_updated_at BEFORE UPDATE ON public.payment_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_obligations_updated_at BEFORE UPDATE ON public.compliance_obligations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_sequences_updated_at BEFORE UPDATE ON public.email_sequences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generated_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_obligations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Business policies
CREATE POLICY "Users can view own businesses" ON public.businesses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own businesses" ON public.businesses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own businesses" ON public.businesses
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own businesses" ON public.businesses
  FOR DELETE USING (auth.uid() = user_id);

-- Risk assessment policies
CREATE POLICY "Users can view own assessments" ON public.risk_assessments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own assessments" ON public.risk_assessments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assessments" ON public.risk_assessments
  FOR UPDATE USING (auth.uid() = user_id);

-- Quiz questions are public read
CREATE POLICY "Anyone can view active quiz questions" ON public.quiz_questions
  FOR SELECT USING (is_active = true);

-- Quiz answers policies
CREATE POLICY "Users can view own quiz answers" ON public.quiz_answers
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.risk_assessments
      WHERE risk_assessments.id = quiz_answers.assessment_id
      AND risk_assessments.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own quiz answers" ON public.quiz_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.risk_assessments
      WHERE risk_assessments.id = quiz_answers.assessment_id
      AND risk_assessments.user_id = auth.uid()
    )
  );

-- Document templates are public read
CREATE POLICY "Anyone can view active document templates" ON public.document_templates
  FOR SELECT USING (is_active = true);

-- Generated documents policies
CREATE POLICY "Users can view own documents" ON public.generated_documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own documents" ON public.generated_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.generated_documents
  FOR UPDATE USING (auth.uid() = user_id);

-- Subscription policies
CREATE POLICY "Users can view own subscription" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Payment transaction policies
CREATE POLICY "Users can view own transactions" ON public.payment_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Compliance obligations policies
CREATE POLICY "Users can view own obligations" ON public.compliance_obligations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = compliance_obligations.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create own obligations" ON public.compliance_obligations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = compliance_obligations.business_id
      AND businesses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own obligations" ON public.compliance_obligations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.businesses
      WHERE businesses.id = compliance_obligations.business_id
      AND businesses.user_id = auth.uid()
    )
  );

-- Email sequence policies
CREATE POLICY "Users can view own email sequences" ON public.email_sequences
  FOR SELECT USING (auth.uid() = user_id);

-- Email log policies
CREATE POLICY "Users can view own email logs" ON public.email_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Audit log policies (users can only view their own audit logs)
CREATE POLICY "Users can view own audit logs" ON public.audit_logs
  FOR SELECT USING (auth.uid() = user_id);
