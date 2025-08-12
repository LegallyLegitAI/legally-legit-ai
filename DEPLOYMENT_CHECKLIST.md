# 🚀 DEPLOYMENT CHECKLIST - Legally Legit AI

## ⚠️ CRITICAL SECURITY ACTIONS (DO IMMEDIATELY)

### 🔴 ROTATE COMPROMISED KEYS NOW
- [ ] **Stripe Live Keys** - Go to https://dashboard.stripe.com/apikeys
  - [ ] Roll/regenerate secret key
  - [ ] Update webhook endpoint secret
  - [ ] Update all backend services with new keys
  
- [ ] **OpenAI API Key** - Go to https://platform.openai.com/api-keys
  - [ ] Delete compromised key
  - [ ] Create new key with limited scope
  - [ ] Set usage limits
  
- [ ] **Supabase Service Role Key** - Go to Supabase Dashboard > Settings > API
  - [ ] Regenerate service role key
  - [ ] Update Edge Functions with new key
  - [ ] NEVER put in frontend code

## ✅ PRE-DEPLOYMENT CHECKLIST

### 1. Security Configuration
- [ ] All production keys rotated
- [ ] .env.local removed from git history
- [ ] Only public keys in frontend code
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Rate limiting configured

### 2. Environment Variables (Vercel Dashboard)
```
Required in Vercel:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY (public key only!)
- VITE_STRIPE_PUBLISHABLE_KEY (public key only!)
- VITE_APP_URL (production URL)
- VITE_APP_NAME
- VITE_APP_ENV=production

Backend/Serverless only:
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- OPENAI_API_KEY (if using)
```

### 3. Database Setup
- [ ] Supabase project created
- [ ] Database schema deployed
- [ ] Row Level Security (RLS) enabled
- [ ] Auth providers configured
- [ ] Storage buckets created with policies

### 4. Stripe Configuration
- [ ] Products and prices created
- [ ] Webhook endpoints configured
- [ ] Customer portal activated
- [ ] Tax settings configured for Australia (GST)
- [ ] Test mode verified before switching to live

### 5. Code Quality
- [ ] TypeScript builds without errors ✅
- [ ] No console.logs in production code
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Form validation on all inputs

### 6. Legal Compliance
- [ ] Privacy Policy updated with actual data practices
- [ ] Terms of Service reviewed
- [ ] Cookie consent implemented
- [ ] Data retention policies defined
- [ ] GDPR/Privacy Act compliance verified

### 7. Testing
- [ ] Auth flow (signup, login, logout)
- [ ] Payment flow with test cards
- [ ] Document generation
- [ ] Email notifications
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 8. Performance
- [ ] Bundle size < 500KB
- [ ] Lighthouse score > 90
- [ ] Images optimized
- [ ] Lazy loading implemented
- [ ] CDN configured

### 9. Monitoring
- [ ] Error tracking (Sentry/LogRocket)
- [ ] Analytics configured
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Security monitoring

### 10. Backup & Recovery
- [ ] Database backups enabled
- [ ] Disaster recovery plan
- [ ] Data export functionality
- [ ] Rollback procedure documented

## 📋 DEPLOYMENT STEPS

### Local Verification
```bash
# 1. Clean install
Remove-Item -Recurse -Force node_modules
npm install

# 2. Type check
npx tsc --noEmit

# 3. Build
npm run build

# 4. Test locally
npm run preview
```

### Vercel Deployment
```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy to staging
vercel --prod=false

# 4. Test staging thoroughly

# 5. Deploy to production
vercel --prod
```

## 🔥 POST-DEPLOYMENT

### Immediate Actions
1. [ ] Verify all features working
2. [ ] Check error logs
3. [ ] Monitor performance metrics
4. [ ] Test payment flow with real card
5. [ ] Send test emails

### Within 24 Hours
1. [ ] Review security logs
2. [ ] Check for any exposed secrets
3. [ ] Monitor user signups
4. [ ] Review error rates
5. [ ] Update documentation

### Weekly
1. [ ] Security audit
2. [ ] Performance review
3. [ ] User feedback analysis
4. [ ] Database optimization
5. [ ] Cost analysis

## 🚨 ROLLBACK PROCEDURE

If issues arise:
1. Revert to previous deployment in Vercel
2. Restore database from backup if needed
3. Notify users of temporary downtime
4. Investigate root cause
5. Fix and re-deploy with extra testing

## 📞 EMERGENCY CONTACTS

- Supabase Support: https://supabase.com/support
- Stripe Support: https://support.stripe.com
- Vercel Support: https://vercel.com/support

## ⚖️ LEGAL REQUIREMENTS

Before going live:
- [ ] Professional indemnity insurance
- [ ] Business registration (ABN/ACN)
- [ ] Legal disclaimer on all documents
- [ ] Clear scope of service
- [ ] Refund policy defined

---

**Remember**: Security is not optional. Take the time to properly secure your application before launching.
