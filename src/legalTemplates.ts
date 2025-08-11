export interface TemplateField {
  id: string
  label: string
  type: 'text' | 'email' | 'select' | 'textarea' | 'date' | 'number'
  placeholder?: string
  required?: boolean
  options?: string[]
  helpText?: string
  warning?: string
}

export interface Template {
  id: string
  title: string
  description: string
  fields: TemplateField[]
  generateContent: (data: Record<string, string>) => string
}

export const templates: Template[] = [
  {
    id: 'employment',
    title: 'Employment Agreement',
    description: 'Fair Work compliant employment contract for Australian businesses',
    fields: [
      {
        id: 'employerName',
        label: 'Employer Name (Company)',
        type: 'text',
        placeholder: 'ABC Pty Ltd',
        required: true
      },
      {
        id: 'employerABN',
        label: 'Employer ABN',
        type: 'text',
        placeholder: '12 345 678 901',
        required: true,
        helpText: 'Your Australian Business Number'
      },
      {
        id: 'employeeName',
        label: 'Employee Full Name',
        type: 'text',
        required: true
      },
      {
        id: 'position',
        label: 'Position Title',
        type: 'text',
        placeholder: 'Sales Manager',
        required: true
      },
      {
        id: 'startDate',
        label: 'Employment Start Date',
        type: 'date',
        required: true
      },
      {
        id: 'employmentType',
        label: 'Employment Type',
        type: 'select',
        options: ['Full-time', 'Part-time', 'Casual'],
        required: true,
        warning: 'Ensure this matches the Modern Award classification'
      },
      {
        id: 'salary',
        label: 'Annual Salary (or hourly rate)',
        type: 'text',
        placeholder: '$70,000 per annum',
        required: true,
        helpText: 'Must meet or exceed the relevant Modern Award minimum'
      }
    ],
    generateContent: (data) => `
      <h1>EMPLOYMENT AGREEMENT</h1>
      
      <p><strong>This Agreement is made on:</strong> ${new Date().toLocaleDateString('en-AU')}</p>
      
      <p><strong>BETWEEN:</strong></p>
      <p>${data.employerName} (ABN: ${data.employerABN}) ("the Employer")</p>
      
      <p><strong>AND:</strong></p>
      <p>${data.employeeName} ("the Employee")</p>
      
      <h2>1. POSITION AND DUTIES</h2>
      <p>The Employer agrees to employ the Employee in the position of <strong>${data.position}</strong>, 
      commencing on <strong>${data.startDate}</strong>.</p>
      
      <h2>2. EMPLOYMENT TYPE</h2>
      <p>This is a <strong>${data.employmentType}</strong> position.</p>
      
      <h2>3. REMUNERATION</h2>
      <p>The Employee will receive: <strong>${data.salary}</strong></p>
      <p>This amount is inclusive of superannuation contributions as required by law.</p>
      
      <h2>4. HOURS OF WORK</h2>
      <p>Standard hours will be in accordance with the National Employment Standards and any applicable Modern Award.</p>
      
      <h2>5. LEAVE ENTITLEMENTS</h2>
      <p>The Employee is entitled to leave in accordance with the National Employment Standards, including:</p>
      <ul>
        <li>Annual leave</li>
        <li>Personal/carer's leave</li>
        <li>Compassionate leave</li>
        <li>Long service leave (as per state legislation)</li>
      </ul>
      
      <h2>6. TERMINATION</h2>
      <p>Either party may terminate this agreement by providing notice as required under the Fair Work Act 2009 (Cth).</p>
      
      <p class="mt-8"><em><strong>IMPORTANT LEGAL NOTICE:</strong> This is a template only. It must be reviewed by a qualified Australian employment lawyer 
      to ensure compliance with relevant Modern Awards, Enterprise Agreements, and the Fair Work Act 2009 (Cth). 
      Laws vary by state and industry.</em></p>
    `
  },
  {
    id: 'contractor',
    title: 'Contractor Agreement',
    description: 'Independent contractor agreement compliant with ATO guidelines',
    fields: [
      {
        id: 'principalName',
        label: 'Principal Name (Your Company)',
        type: 'text',
        required: true
      },
      {
        id: 'contractorName',
        label: 'Contractor Name',
        type: 'text',
        required: true
      },
      {
        id: 'services',
        label: 'Services to be Provided',
        type: 'textarea',
        placeholder: 'Describe the services...',
        required: true
      },
      {
        id: 'payment',
        label: 'Payment Terms',
        type: 'text',
        placeholder: '$100 per hour',
        required: true
      }
    ],
    generateContent: (data) => `
      <h1>INDEPENDENT CONTRACTOR AGREEMENT</h1>
      
      <p>This Agreement is made between <strong>${data.principalName}</strong> ("Principal") 
      and <strong>${data.contractorName}</strong> ("Contractor").</p>
      
      <h2>1. SERVICES</h2>
      <p>The Contractor agrees to provide the following services:</p>
      <p>${data.services}</p>
      
      <h2>2. PAYMENT</h2>
      <p>The Principal will pay the Contractor: <strong>${data.payment}</strong></p>
      
      <h2>3. RELATIONSHIP</h2>
      <p>The Contractor is engaged as an independent contractor and not as an employee. 
      The Contractor is responsible for their own tax, superannuation, and insurance.</p>
      
      <p class="mt-8"><em><strong>WARNING:</strong> Ensure this arrangement meets ATO guidelines for genuine contracting. 
      Sham contracting penalties apply under the Fair Work Act 2009.</em></p>
    `
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    description: 'APP-compliant privacy policy for Australian businesses',
    fields: [
      {
        id: 'businessName',
        label: 'Business Name',
        type: 'text',
        required: true
      },
      {
        id: 'businessABN',
        label: 'ABN',
        type: 'text',
        required: true
      },
      {
        id: 'websiteUrl',
        label: 'Website URL',
        type: 'text',
        placeholder: 'https://example.com.au',
        required: true
      }
    ],
    generateContent: (data) => `
      <h1>PRIVACY POLICY</h1>
      
      <p><strong>${data.businessName}</strong> (ABN: ${data.businessABN}) is committed to protecting your privacy 
      in accordance with the Australian Privacy Principles under the Privacy Act 1988 (Cth).</p>
      
      <h2>1. INFORMATION WE COLLECT</h2>
      <p>We may collect personal information including names, contact details, and payment information.</p>
      
      <h2>2. HOW WE USE YOUR INFORMATION</h2>
      <p>We use your information to provide our services and comply with legal obligations.</p>
      
      <h2>3. DATA SECURITY</h2>
      <p>We implement appropriate security measures to protect your personal information.</p>
      
      <h2>4. YOUR RIGHTS</h2>
      <p>You have the right to access and correct your personal information.</p>
      
      <p class="mt-8"><em>This template complies with Australian Privacy Principles. 
      Customize for your specific data practices.</em></p>
    `
  }
]