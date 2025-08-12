# Functional Specification - Legally Legit AI

## Document Information
- **Version:** 1.0
- **Last Updated:** January 2025
- **Author:** Product Team
- **Status:** Draft
- **Review Cycle:** Quarterly

---

## 1. Account & Authentication System

### 1.1 User Registration

#### Functional Requirements
- Support email/password registration
- Social authentication (Google, Microsoft, LinkedIn)
- Email verification required
- Password strength enforcement
- Terms acceptance tracking

#### Acceptance Criteria
```gherkin
GIVEN a new user on the registration page
WHEN they provide valid email and password (min 12 chars, 1 upper, 1 lower, 1 number, 1 special)
AND accept terms and privacy policy
THEN account is created in 'pending verification' state
AND verification email is sent within 30 seconds
AND user session is created with limited access

GIVEN a user clicks social auth
WHEN they authorize via OAuth 2.0 provider
THEN account is created with verified email status
AND profile is pre-populated from social provider
```

### 1.2 Multi-Factor Authentication (MFA)

#### Functional Requirements
- TOTP-based authentication (Google Authenticator, Authy)
- SMS backup codes (Australian mobile numbers)
- Recovery codes generation
- MFA enforcement for sensitive operations

#### Acceptance Criteria
```gherkin
GIVEN a logged-in user
WHEN they enable MFA in security settings
THEN they must scan QR code or enter setup key
AND verify with 6-digit code
AND receive 10 backup codes
AND MFA status is marked as active

GIVEN MFA is enabled
WHEN user logs in with correct credentials
THEN they must provide TOTP code within 30 seconds
AND have option to trust device for 30 days
```

### 1.3 Session Management

#### Functional Requirements
- JWT-based sessions with refresh tokens
- Concurrent session limits (3 devices)
- Session timeout (30 min inactive, 24hr absolute)
- Device management dashboard

#### Acceptance Criteria
```gherkin
GIVEN an authenticated user
WHEN they remain inactive for 30 minutes
THEN session expires and requires re-authentication
AND sensitive data is cleared from local storage

GIVEN a user logged in on 3 devices
WHEN they attempt login on 4th device
THEN oldest session is terminated
AND notification sent to affected device
```

---

## 2. Organization & Team Model

### 2.1 Organization Structure

#### Functional Requirements
- Multiple organizations per account owner
- Organization profiles (ABN, business name, industry)
- Billing segregation per organization
- Cross-organization switching

#### Data Model
```sql
Organizations
- id: UUID
- owner_id: UUID (Users.id)
- abn: string (validated against ABR)
- business_name: string
- trading_name: string
- industry_code: ANZSIC
- employee_count: enum
- state: AU state code
- created_at: timestamp
- subscription_id: UUID
```

#### Acceptance Criteria
```gherkin
GIVEN an authenticated user
WHEN they create an organization
THEN they must provide valid ABN
AND ABN is verified against ABR API
AND organization is set as default
AND owner has 'admin' role automatically

GIVEN a user with multiple organizations
WHEN they switch organizations via dropdown
THEN context changes within 500ms
AND all data is scoped to selected organization
AND last selected org is remembered
```

### 2.2 Team Members & Permissions

#### Functional Requirements
- Role-based access control (Owner, Admin, Editor, Viewer)
- Invitation system with email verification
- Permission matrix for features
- Audit log of permission changes

#### Permission Matrix
| Feature | Owner | Admin | Editor | Viewer |
|---------|-------|-------|--------|--------|
| Billing | ✓ | ✗ | ✗ | ✗ |
| Team Management | ✓ | ✓ | ✗ | ✗ |
| Document Creation | ✓ | ✓ | ✓ | ✗ |
| Document Viewing | ✓ | ✓ | ✓ | ✓ |
| Settings | ✓ | ✓ | ✗ | ✗ |
| Compliance Reports | ✓ | ✓ | ✓ | ✓ |

#### Acceptance Criteria
```gherkin
GIVEN an admin user
WHEN they invite a team member via email
THEN invitation expires in 7 days
AND invitee must create account or login
AND correct role is assigned upon acceptance
AND invitation can be revoked before acceptance

GIVEN a team member with Editor role
WHEN they attempt to access billing
THEN they receive 403 Forbidden error
AND action is logged in audit trail
```

---

## 3. Guided Wizards & Intake

### 3.1 Wizard Framework

#### Functional Requirements
- Step-by-step progression with validation
- Conditional logic based on answers
- Save and resume capability
- Progress tracking and time estimates

#### Wizard Types
1. **Business Profile Wizard** (10-15 questions)
2. **Privacy Policy Wizard** (20-30 questions)
3. **Employment Contract Wizard** (30-40 questions)
4. **Contractor Assessment Wizard** (15-20 questions)

#### Acceptance Criteria
```gherkin
GIVEN a user starts Privacy Policy wizard
WHEN they complete each step
THEN next step is determined by conditional logic
AND progress is auto-saved every 30 seconds
AND they can navigate back without losing data
AND estimated time remaining is displayed

GIVEN a wizard is partially completed
WHEN user returns after 30 days
THEN they can resume from last step
AND are warned if laws have changed
AND can restart with updated questions
```

### 3.2 Question Types & Validation

#### Supported Input Types
- Single select (radio buttons)
- Multi-select (checkboxes)
- Text input (with regex validation)
- Number input (with min/max)
- Date picker
- ABN/ACN lookup
- Industry classifier (ANZSIC)
- Address with postcode validation

#### Acceptance Criteria
```gherkin
GIVEN a required field in wizard
WHEN user attempts to proceed without answering
THEN inline validation error is shown
AND next button remains disabled
AND error is announced to screen readers

GIVEN an ABN input field
WHEN user enters ABN
THEN it's validated against ABR in real-time
AND business name is auto-populated
AND GST registration status is checked
```

---

## 4. Document Automation Engine

### 4.1 Template System

#### Functional Requirements
- Clause library with versioning
- Conditional clause insertion
- Variable substitution
- Australian legal formatting standards
- Multi-jurisdiction variations (states/territories)

#### Template Structure
```yaml
template:
  id: privacy-policy-au
  version: 2.1.0
  jurisdiction: AU
  last_reviewed: 2025-01-01
  sections:
    - id: collection-notice
      required: true
      conditions:
        - if: collects_personal_info == true
      variables:
        - business_name
        - abn
      clauses:
        - id: standard-collection
        - id: sensitive-info
          condition: collects_health_info == true
```

#### Acceptance Criteria
```gherkin
GIVEN a document template
WHEN user completes intake wizard
THEN appropriate clauses are selected based on logic
AND variables are replaced with actual values
AND formatting follows Australian legal standards
AND document is tagged with version and date

GIVEN template has state variations
WHEN user selects NSW as jurisdiction
THEN NSW-specific clauses are used
AND federal requirements are maintained
AND conflicts are resolved per hierarchy
```

### 4.2 Document Generation

#### Functional Requirements
- Real-time preview during wizard
- Syntax highlighting for changes
- Track changes between versions
- Comments and annotations support
- Legal disclaimer insertion

#### Acceptance Criteria
```gherkin
GIVEN completed wizard data
WHEN document is generated
THEN generation completes within 3 seconds
AND preview is available immediately
AND document passes legal validation rules
AND audit entry is created with parameters

GIVEN a previously generated document
WHEN laws change affecting the document
THEN user is notified within 48 hours
AND can regenerate with one click
AND changes are highlighted in diff view
```

---

## 5. E-Signature Workflow

### 5.1 Signature Request Creation

#### Functional Requirements
- Multiple signatories support
- Sequential and parallel signing
- Signature fields placement
- Witness requirements (where needed)
- Signing deadline settings

#### Acceptance Criteria
```gherkin
GIVEN a document ready for signature
WHEN user initiates signature request
THEN they can add up to 10 signatories
AND define signing order if sequential
AND set expiry date (default 30 days)
AND preview email to signatories

GIVEN Australian witness requirements
WHEN document type requires witnessing
THEN witness fields are auto-added
AND witness must sign after primary signatory
AND witness details are captured (name, address)
```

### 5.2 Signature Collection

#### Functional Requirements
- Email-based signature invitations
- SMS verification for signatories
- In-app signature drawing/typing
- IP address and timestamp capture
- Certificate of completion generation

#### Acceptance Criteria
```gherkin
GIVEN a signatory receives invitation
WHEN they click unique signing link
THEN document opens in secure viewer
AND they must verify identity via SMS OTP
AND can draw, type, or upload signature
AND signing is completed within session

GIVEN all parties have signed
WHEN final signature is applied
THEN certificate is auto-generated
AND includes all party details and timestamps
AND tamper-evident seal is applied
AND all parties receive completed copy
```

### 5.3 Audit Trail

#### Functional Requirements
- Comprehensive event logging
- Legally admissible format
- Chain of custody tracking
- Download audit report

#### Audit Events
- Document uploaded/created
- Signature request sent
- Document viewed
- Document downloaded
- Signature applied
- Request cancelled/expired

#### Acceptance Criteria
```gherkin
GIVEN a signature workflow
WHEN any action occurs
THEN event is logged within 100ms
AND includes actor, action, timestamp, IP
AND hash of document state is recorded
AND audit log is immutable

GIVEN completed signature process
WHEN audit report is requested
THEN PDF report is generated
AND includes full chain of custody
AND meets Australian court requirements
```

---

## 6. Payments & Billing

### 6.1 Subscription Management

#### Functional Requirements
- Stripe integration for payments
- Australian GST calculation (10%)
- Tax invoice generation
- Payment method management
- Subscription upgrades/downgrades

#### Acceptance Criteria
```gherkin
GIVEN a user selects subscription plan
WHEN they enter payment details
THEN Stripe payment intent is created
AND GST is calculated at 10%
AND total includes GST clearly shown
AND payment processes via 3D Secure if required

GIVEN an active subscription
WHEN user upgrades mid-cycle
THEN pro-rata charge is calculated
AND immediate access to new features
AND tax invoice is generated and emailed
```

### 6.2 Invoice & Receipt Generation

#### Functional Requirements
- ATO-compliant tax invoices
- ABN and GST registration display
- Sequential invoice numbering
- PDF generation and email delivery
- Invoice history and downloads

#### Tax Invoice Requirements
```
Must Include:
- "Tax Invoice" prominently displayed
- Supplier's identity and ABN
- Date of issue
- Brief description of items
- GST amount shown separately
- Total amount payable
```

#### Acceptance Criteria
```gherkin
GIVEN a successful payment
WHEN tax invoice is generated
THEN it includes all ATO requirements
AND is emailed within 5 minutes
AND saved to customer's account
AND available for download anytime

GIVEN a refund is processed
WHEN adjustment note is needed
THEN it references original invoice
AND shows negative GST amount
AND maintains audit trail
```

---

## 7. Notifications System

### 7.1 Email Notifications

#### Functional Requirements
- Transactional emails via Resend
- Email templates with personalization
- Unsubscribe management
- Delivery tracking and bounces
- CAN-SPAM/Spam Act compliance

#### Notification Types
| Type | Trigger | Opt-out Allowed |
|------|---------|-----------------|
| Account Verification | Registration | No |
| Password Reset | User request | No |
| Document Ready | Generation complete | Yes |
| Signature Request | Workflow initiated | No |
| Law Change Alert | Monitoring system | Yes |
| Payment Receipt | Transaction | No |
| Compliance Reminder | Calendar event | Yes |

#### Acceptance Criteria
```gherkin
GIVEN a notification trigger occurs
WHEN email is sent
THEN it's queued within 1 second
AND delivered within 5 minutes
AND includes unsubscribe link if allowed
AND delivery status is tracked

GIVEN user unsubscribes from marketing
WHEN they receive transactional email
THEN it only contains essential information
AND marketing content is excluded
AND preference is immediately applied
```

### 7.2 In-App Notifications

#### Functional Requirements
- Real-time push via WebSockets
- Notification center with history
- Read/unread status tracking
- Priority levels (info, warning, critical)
- Click-through to relevant section

#### Acceptance Criteria
```gherkin
GIVEN user is logged in
WHEN notification is triggered
THEN it appears within 2 seconds
AND shows in notification bell icon
AND persists until marked read
AND deep links to relevant content

GIVEN multiple unread notifications
WHEN user opens notification center
THEN they're sorted by priority then date
AND can mark all as read
AND can filter by type
```

### 7.3 Compliance Calendar

#### Functional Requirements
- Important date tracking
- Recurring compliance events
- Integration with notifications
- iCal export capability
- Public holiday awareness

#### Calendar Events
- Document renewal dates
- Filing deadlines
- Law change effective dates
- Training requirements
- Audit schedules

#### Acceptance Criteria
```gherkin
GIVEN a compliance deadline
WHEN it's 30 days away
THEN reminder notification is sent
AND appears in calendar view
AND subsequent reminders at 14, 7, 1 days

GIVEN recurring annual requirement
WHEN user completes it
THEN next occurrence is auto-scheduled
AND completion is logged
AND evidence can be attached
```

---

## 8. Risk Scoring & Dashboard

### 8.1 Risk Calculation Engine

#### Functional Requirements
- Multi-factor risk scoring
- Industry-specific weightings
- Real-time score updates
- Historical trending
- Peer benchmarking

#### Risk Factors
```javascript
riskFactors = {
  privacy: {
    weight: 0.3,
    factors: [
      'hasPrivacyPolicy',
      'dataBreachPlan',
      'consentManagement',
      'crossBorderData'
    ]
  },
  employment: {
    weight: 0.25,
    factors: [
      'contractsCurrent',
      'awardCompliance',
      'recordKeeping'
    ]
  },
  consumer: {
    weight: 0.2,
    factors: [
      'termsConditions',
      'refundPolicy',
      'advertisingCompliance'
    ]
  }
}
```

#### Acceptance Criteria
```gherkin
GIVEN organization compliance data
WHEN risk score is calculated
THEN score ranges from 0-100
AND is updated within 5 seconds of changes
AND breakdown by category is shown
AND improvement suggestions are provided

GIVEN risk score below 60
WHEN displayed on dashboard
THEN shown in red with warning icon
AND top 3 actions are highlighted
AND estimated improvement per action shown
```

### 8.2 Executive Dashboard

#### Functional Requirements
- Key metrics visualization
- Customizable widgets
- Data export capability
- Mobile responsive design
- Role-based data access

#### Default Widgets
- Overall Compliance Score
- Document Status Summary
- Upcoming Deadlines
- Team Activity
- Law Change Alerts
- Monthly Trend Chart

#### Acceptance Criteria
```gherkin
GIVEN user opens dashboard
WHEN page loads
THEN data displays within 2 seconds
AND is accurate as of last refresh
AND refresh timestamp is shown
AND can manually refresh data

GIVEN custom dashboard configuration
WHEN user adds/removes widgets
THEN changes save automatically
AND persist across sessions
AND respect screen size constraints
```

---

## 9. Admin Backoffice

### 9.1 Customer Management

#### Functional Requirements
- Customer search and filtering
- Account status management
- Subscription overrides
- Support ticket integration
- Activity logs viewing

#### Acceptance Criteria
```gherkin
GIVEN admin user in backoffice
WHEN searching for customer
THEN can search by email, ABN, name
AND results return within 1 second
AND show subscription status
AND display last activity

GIVEN customer requires support
WHEN admin accesses account
THEN can impersonate with audit log
AND can adjust subscription
AND can trigger password reset
AND all actions are logged
```

### 9.2 KYC & Compliance Monitoring

#### Functional Requirements
- Automated ABN verification
- High-risk industry flagging
- Suspicious activity detection
- Manual review queues
- Reporting to authorities (if required)

#### Risk Indicators
- Invalid/cancelled ABN
- High-risk industries (financial services, gambling)
- Unusual document patterns
- Multiple failed payments
- Rapid account changes

#### Acceptance Criteria
```gherkin
GIVEN new organization registration
WHEN ABN validation fails
THEN account is flagged for review
AND limited to basic features
AND admin receives alert
AND manual verification required

GIVEN suspicious activity detected
WHEN threshold is exceeded
THEN account is auto-suspended
AND customer is notified
AND requires admin review
AND decision is documented
```

### 9.3 Content Management

#### Functional Requirements
- Template version control
- Clause library management
- Law update publishing
- A/B testing capability
- Translation management

#### Acceptance Criteria
```gherkin
GIVEN template requires update
WHEN admin publishes new version
THEN existing documents are unaffected
AND new generations use latest version
AND changelog is maintained
AND rollback is possible

GIVEN law change occurs
WHEN admin creates update
THEN affected customers are identified
AND notifications are scheduled
AND grace period is defined
AND update can be previewed
```

---

## 10. Export & Reporting

### 10.1 Document Export

#### Functional Requirements
- Multiple format support (PDF, DOCX)
- Batch export capability
- Watermarking options
- Metadata preservation
- Compression for large exports

#### Acceptance Criteria
```gherkin
GIVEN user selects documents
WHEN export is requested
THEN formats are PDF and DOCX
AND export completes within 30 seconds
AND maintains formatting and structure
AND includes metadata in properties

GIVEN batch export request
WHEN more than 10 documents
THEN ZIP archive is created
AND folder structure is logical
AND index file is included
AND download link expires in 24 hours
```

### 10.2 Evidence Bundle Generation

#### Functional Requirements
- Compliance evidence compilation
- Chronological ordering
- Table of contents generation
- Cover page with attestation
- Admissible format for regulators

#### Bundle Contents
- Compliance certificates
- Signed documents
- Audit trails
- Policy versions
- Training records
- Incident reports

#### Acceptance Criteria
```gherkin
GIVEN compliance audit request
WHEN evidence bundle is generated
THEN includes all relevant documents
AND ordered chronologically
AND numbered consecutively
AND includes executive summary
AND generates within 60 seconds

GIVEN regulator submission
WHEN bundle is exported
THEN meets ASIC/ACCC requirements
AND includes affidavit template
AND is tamper-evident
AND includes verification codes
```

---

## 11. Non-Functional Requirements

### 11.1 Security Requirements

#### Authentication & Authorization
- **Requirement**: OWASP Top 10 compliance
- **Implementation**: 
  - BCrypt password hashing (cost factor 12)
  - JWT tokens with 15-minute expiry
  - Refresh tokens with rotation
  - Rate limiting: 5 attempts per minute
- **Acceptance**: Penetration test annually, security scan weekly

#### Data Encryption
- **At Rest**: AES-256 encryption for database
- **In Transit**: TLS 1.3 minimum
- **Key Management**: AWS KMS or equivalent
- **Acceptance**: SSL Labs A+ rating

#### Application Security
```yaml
security_headers:
  Content-Security-Policy: "default-src 'self'"
  X-Frame-Options: "DENY"
  X-Content-Type-Options: "nosniff"
  Strict-Transport-Security: "max-age=31536000"
  X-XSS-Protection: "1; mode=block"
```

### 11.2 Privacy Requirements

#### Data Minimization
- Collect only necessary data
- Retention periods defined per data type
- Automated deletion after retention
- Audit log: 7 years (legal requirement)

#### Privacy Controls
- **Right to Access**: Export within 30 days
- **Right to Rectification**: Self-service where possible
- **Right to Erasure**: Within 30 days unless legal obligation
- **Data Portability**: JSON/CSV export formats

#### Acceptance Criteria
```gherkin
GIVEN GDPR/Privacy Act request
WHEN user requests data export
THEN provided within 30 days
AND includes all personal data
AND in machine-readable format
AND audit log entry created
```

### 11.3 Audit Logging

#### Audit Events
```json
{
  "timestamp": "2025-01-15T10:30:00Z",
  "actor": {
    "id": "user-uuid",
    "ip": "203.45.67.89",
    "userAgent": "Mozilla/5.0..."
  },
  "action": "document.create",
  "resource": {
    "type": "privacy_policy",
    "id": "doc-uuid"
  },
  "result": "success",
  "metadata": {
    "duration": 1250,
    "changes": []
  }
}
```

#### Retention & Access
- **Retention**: 7 years minimum
- **Immutability**: Write-once storage
- **Search**: Full-text search capability
- **Export**: CSV/JSON formats
- **Access**: Role-based viewing

### 11.4 Availability Requirements

#### Service Level Objectives
| Service | Availability | Measured |
|---------|-------------|----------|
| Web Application | 99.9% | Monthly |
| API | 99.95% | Monthly |
| Document Generation | 99.5% | Monthly |
| Payment Processing | 99.99% | Monthly |

#### Disaster Recovery
- **RTO**: 4 hours
- **RPO**: 1 hour
- **Backup**: Daily automated, tested monthly
- **Multi-region**: Active-passive setup

### 11.5 Performance Requirements

#### Response Time Targets
| Operation | Target (p95) | Maximum |
|-----------|-------------|---------|
| Page Load | < 2s | 5s |
| API Response | < 500ms | 2s |
| Document Generation | < 5s | 30s |
| Search Results | < 1s | 3s |
| Dashboard Refresh | < 3s | 10s |

#### Scalability
- Support 10,000 concurrent users
- Handle 100 requests/second
- Auto-scale based on CPU/memory
- Database connection pooling

### 11.6 Error Budget & Monitoring

#### Error Budget Definition
```yaml
error_budget:
  period: 30 days
  target_availability: 99.9%
  allowed_downtime: 43.2 minutes
  error_threshold: 0.1%
```

#### Monitoring Stack
- **APM**: Datadog or New Relic
- **Logs**: CloudWatch/Stackdriver
- **Uptime**: Pingdom/UptimeRobot
- **Errors**: Sentry/Rollbar
- **Analytics**: Mixpanel/Amplitude

#### Alerting Rules
| Metric | Threshold | Action |
|--------|-----------|--------|
| Error Rate | > 1% | Page on-call |
| Response Time | > 5s (p95) | Slack alert |
| CPU Usage | > 80% | Auto-scale |
| Disk Space | < 20% | Email ops |
| Failed Payments | > 5/hour | Page support |

---

## 12. Data Processing Agreement (DPA) Template

### 12.1 Standard DPA Clauses

```markdown
# DATA PROCESSING AGREEMENT

This Data Processing Agreement ("DPA") forms part of the Terms of Service between Legally Legit AI Pty Ltd ("Processor") and Customer ("Controller").

## 1. DEFINITIONS
- "Personal Data": Any information relating to an identified or identifiable natural person
- "Processing": Any operation performed on Personal Data
- "Data Subject": Individual whose Personal Data is processed

## 2. PROCESSING OF PERSONAL DATA
2.1 Processor shall:
- Process Personal Data only on documented instructions from Controller
- Ensure persons authorized to process Personal Data have committed to confidentiality
- Implement appropriate technical and organizational measures
- Assist Controller in responding to data subject requests

## 3. SECURITY MEASURES
Processor implements and maintains:
- Encryption of data at rest and in transit
- Access controls and authentication
- Regular security assessments
- Incident response procedures
- Business continuity planning

## 4. SUB-PROCESSORS
Current sub-processors:
- Supabase (Database) - USA
- Stripe (Payments) - USA/Australia  
- Resend (Email) - USA
- AWS (Infrastructure) - Australia

## 5. INTERNATIONAL TRANSFERS
- Data primarily stored in Australia
- Transfers outside Australia subject to appropriate safeguards
- Standard Contractual Clauses available upon request

## 6. AUDIT RIGHTS
Controller may audit compliance annually with 30 days notice

## 7. BREACH NOTIFICATION
Processor will notify Controller within 72 hours of becoming aware of any breach

## 8. DATA RETURN AND DELETION
Upon termination, all Personal Data will be returned or deleted within 30 days

## 9. LIABILITY
Limited to the amount paid in the 12 months preceding the incident

## 10. GOVERNING LAW
This DPA is governed by the laws of New South Wales, Australia
```

### 12.2 Customer-Specific Customization

#### Available Modifications
- Additional security measures
- Specific retention periods
- Custom sub-processor approval
- Enhanced audit rights
- Specific compliance standards (ISO 27001, SOC 2)

---

## 13. Compliance & Certifications

### Required Compliance
- **Privacy Act 1988 (Cth)** - Full compliance
- **Australian Privacy Principles** - All 13 principles
- **Spam Act 2003** - Electronic messaging
- **PCI DSS** - Level 4 (via Stripe)
- **GST/Tax** - ATO requirements

### Target Certifications (Year 1)
- ISO 27001 (Information Security)
- SOC 2 Type II (by month 12)
- Cyber Essentials Plus

---

## 14. Implementation Priorities

### Phase 1: MVP (Months 1-3)
1. Basic auth (email/password)
2. Single organization model
3. Privacy policy wizard
4. PDF export
5. Stripe payments
6. Email notifications

### Phase 2: Growth (Months 4-6)
1. Social auth & MFA
2. Team management
3. Employment wizards
4. E-signature workflow
5. Risk scoring
6. In-app notifications

### Phase 3: Scale (Months 7-9)
1. Multi-org support
2. Advanced wizards
3. Full document automation
4. Admin backoffice
5. Evidence bundles
6. Compliance calendar

### Phase 4: Enterprise (Months 10-12)
1. SSO integration
2. Advanced permissions
3. API access
4. Custom workflows
5. White-label options
6. SOC 2 certification

---

## Appendix A: Technical Architecture

### Technology Stack
- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Payments**: Stripe
- **Email**: Resend
- **Documents**: pdf-lib, Puppeteer
- **Signatures**: Internal implementation
- **Monitoring**: Datadog
- **CDN**: Cloudflare

### Database Schema (Core Tables)
```sql
-- Users table handled by Supabase Auth

-- Organizations
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id),
  abn VARCHAR(11) UNIQUE,
  business_name VARCHAR(255) NOT NULL,
  subscription_status VARCHAR(50),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES organizations(id),
  type VARCHAR(50) NOT NULL,
  version VARCHAR(10),
  content JSONB,
  status VARCHAR(50),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  metadata JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Document Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Manager | | | |
| Tech Lead | | | |
| Legal Advisor | | | |
| Security Officer | | | |
