export const featuresSeed = [
  { group: 'benefit' as const, title: 'Live implementation', description: 'Cameras on. Your files on the table. Every evening ends with something running.', icon: 'radio', isFeatured: true, order: 0 },
  { group: 'benefit' as const, title: 'Your processes, not case studies', description: 'Quotations, follow-ups, reports, hiring replies — we build on the work you already do.', icon: 'workflow', isFeatured: true, order: 1 },
  { group: 'benefit' as const, title: 'Support until the last session', description: 'Tool setup, integrations and stubborn prompts are handled with you, not left to you.', icon: 'life-buoy', isFeatured: true, order: 2 },
  { group: 'benefit' as const, title: 'Systems your team can run', description: 'Every workflow is documented as an SOP so it survives beyond the person who built it.', icon: 'users', order: 3 },
  { group: 'audience' as const, title: 'Owners and founders', description: 'Carrying too much daily execution yourself.', icon: 'briefcase', order: 0 },
  { group: 'audience' as const, title: 'Manufacturers, traders, service firms', description: 'Repeatable paperwork, quotations and reporting cycles.', icon: 'factory', order: 1 },
  { group: 'audience' as const, title: 'Professionals and consultants', description: 'Output is documents, proposals and client communication.', icon: 'user-check', order: 2 },
  { group: 'support' as const, title: 'Technical support', description: 'Included for the full workshop duration.', icon: 'headset', order: 0 },
  { group: 'support' as const, title: 'Recordings', description: 'Catch up before the next evening. The sequence never breaks.', icon: 'play-circle', order: 1 },
  { group: 'workflow' as const, title: 'Enquiry to proposal', description: 'Raw enquiry → structured brief → draft quotation → human review → send.', icon: 'file-text', beforeLabel: '3 days of drafting', afterLabel: 'A two-hour, repeatable pipeline', order: 0 },
  { group: 'workflow' as const, title: 'Follow-up engine', description: 'Lead list → AI sequence → WhatsApp / email → logged in your sheet.', icon: 'mail', beforeLabel: 'Forgotten follow-ups', afterLabel: 'A sequence that never sleeps', order: 1 },
  { group: 'workflow' as const, title: 'Weekly management report', description: 'Spreadsheet → AI commentary → Monday digest to the team.', icon: 'bar-chart-3', beforeLabel: 'Sunday night scramble', afterLabel: 'A report that arrives on its own', order: 2 },
  { group: 'workflow' as const, title: 'Support knowledge base', description: 'Past replies + policy → assisted answers on WhatsApp and email.', icon: 'messages-square', beforeLabel: 'Same 40 questions every month', afterLabel: 'Assisted replies, human escalation', order: 3 },
  { group: 'usecase' as const, title: 'Manufacturing', description: 'Quotations, vendor follow-ups, dispatch notes and quality summaries.', icon: 'factory', order: 0 },
  { group: 'usecase' as const, title: 'Trading', description: 'Price lists, enquiry routing and collection reminders.', icon: 'truck', order: 1 },
  { group: 'usecase' as const, title: 'Services & agencies', description: 'Proposals, content engines and client reporting.', icon: 'sparkles', order: 2 },
  { group: 'usecase' as const, title: 'Professional firms', description: 'Document drafting, research briefs and SOP libraries.', icon: 'scale', order: 3 },
];

export const contentSectionsSeed = [
  { sectionKey: 'engine', name: 'AI in action concept', eyebrow: 'The idea', title: 'AI is not a tool you try.', titleEmphasis: 'It is a system you run.', subtitle: 'Business problem → AI engine → automation → business result.', body: 'Most people collect prompts. Operators install workflows. This workshop is built for the second group.', layoutVariant: 'pipeline', order: 0, items: [
    { title: 'Business problem', description: 'A real job that currently lives in your calendar.', label: '01', order: 0, isActive: true },
    { title: 'AI engine', description: 'Brief, constraints, brand voice, and the model that drafts.', label: '02', order: 1, isActive: true },
    { title: 'Automation system', description: 'Triggers, tools, checkpoints. It runs without a reminder.', label: '03', order: 2, isActive: true },
    { title: 'Business result', description: 'Hours returned. Cost dropped. A process you can measure.', label: '04', order: 3, isActive: true },
  ]},
  { sectionKey: 'visualization', name: 'Live visualization', eyebrow: 'Live studio', title: 'Watch a process', titleEmphasis: 'move through the engine.', layoutVariant: 'studio', order: 1 },
  { sectionKey: 'transformation', name: 'Before after', eyebrow: 'The shift', title: 'From doing the work', titleEmphasis: 'to owning the system.', layoutVariant: 'before-after', order: 2, items: [
    { title: 'Manual', description: 'Drafting, chasing, formatting — all billed to your day.', label: 'Before', order: 0, isActive: true },
    { title: 'AI-assisted', description: 'You direct, review and approve. The blank page is gone.', label: 'During', order: 1, isActive: true },
    { title: 'Automated', description: 'Triggers replace reminders. Work moves between tools.', label: 'After', order: 2, isActive: true },
    { title: 'Scalable', description: 'Documented, delegated, measurable. Volume can double.', label: 'Owned', order: 3, isActive: true },
  ]},
  { sectionKey: 'experience', name: 'Workshop experience', eyebrow: 'Ten evenings', title: 'A working room,', titleEmphasis: 'not a webinar.', subtitle: '8:00–10:00 PM IST on Zoom. Hindi + English. You implement alongside the trainer.', layoutVariant: 'experience', order: 3 },
  { sectionKey: 'outputs', name: 'What you will build', eyebrow: 'Outputs', title: 'You leave with assets', titleEmphasis: 'already in the business.', layoutVariant: 'outputs', order: 4, items: [
    { title: 'Opportunity map', description: 'Prioritised list of AI jobs specific to your company.', order: 0, isActive: true },
    { title: 'Prompt vault', description: 'Reusable briefs for your highest-frequency tasks.', order: 1, isActive: true },
    { title: 'Two live automations', description: 'Wired into tools you already use.', order: 2, isActive: true },
    { title: 'Custom assistants', description: 'Trained on your catalogues, policies and voice.', order: 3, isActive: true },
    { title: 'SOP library', description: 'So the system survives beyond you.', order: 4, isActive: true },
    { title: '90-day roadmap', description: 'What runs now, what the team owns next.', order: 5, isActive: true },
  ]},
  { sectionKey: 'curriculum', name: 'Curriculum', eyebrow: '10-day journey', title: 'Your implementation', titleEmphasis: 'roadmap, day by day.', footnote: 'Sessions run 8:00 PM – 10:00 PM IST, live on Zoom.', layoutVariant: 'timeline', order: 5 },
  { sectionKey: 'speakers', name: 'Speakers', eyebrow: 'In the room', title: 'Practitioners who', titleEmphasis: 'install systems for a living.', layoutVariant: 'people', order: 6 },
  { sectionKey: 'videos', name: 'Video studio', eyebrow: 'Watch', title: 'Inside the', titleEmphasis: 'workshop room.', layoutVariant: 'swiper', order: 7 },
  { sectionKey: 'testimonials', name: 'Testimonials', eyebrow: 'Proof', title: 'What owners say', titleEmphasis: 'after they implement.', layoutVariant: 'quotes', order: 8 },
  { sectionKey: 'bonuses', name: 'Bonuses', eyebrow: 'Included', title: 'Bonuses worth', titleEmphasis: '₹25,000+.', layoutVariant: 'stack', order: 9 },
  { sectionKey: 'pricing', name: 'Pricing', eyebrow: 'Investment', title: 'One batch.', titleEmphasis: 'One price. Thirty owners.', subtitle: 'Founding-batch pricing. The next batch is ₹15,000.', layoutVariant: 'offer', order: 10 },
  { sectionKey: 'scarcity', name: 'Seats', eyebrow: 'Capacity', title: 'Thirty seats.', titleEmphasis: 'No fake counters.', layoutVariant: 'seats', order: 11 },
  { sectionKey: 'faq', name: 'FAQ', eyebrow: 'Questions', title: 'Straight answers', titleEmphasis: 'before you book.', layoutVariant: 'accordion', order: 12 },
  { sectionKey: 'contact', name: 'Contact', eyebrow: 'Talk first', title: 'Not sure it fits?', titleEmphasis: 'Ask a human.', layoutVariant: 'cards', order: 13 },
  { sectionKey: 'final-cta', name: 'Final CTA', eyebrow: 'Batch 01', title: 'Ten days from now,', titleEmphasis: 'this work can run without you.', layoutVariant: 'closing', order: 14 },
];

export const curriculumSeed = [
  { dayNumber: 1, title: 'AI Foundations for Business Owners', subtitle: 'The implementation mindset', phase: 'Foundation', icon: 'compass', description: 'Map the business the way an implementer sees it: repeatable work, judgement calls, and the hours quietly disappearing.', learningObjectives: ['See what current AI can and cannot do reliably', 'Audit your week for the ten most repeatable tasks', 'Score opportunities by time, cost and risk', 'Set up a working AI environment'], tools: ['ChatGPT', 'Claude', 'Gemini'], outcome: 'A prioritised AI opportunity map', durationLabel: '2 hours', order: 0 },
  { dayNumber: 2, title: 'Prompting That Produces Business-Grade Output', subtitle: 'From vague answers to usable work', phase: 'Foundation', icon: 'message-square-code', description: 'Most disappointing output is a briefing problem. You learn a structure that survives real business complexity.', learningObjectives: ['Apply a repeatable prompt structure', 'Build reusable templates', 'Give AI brand voice and constraints', 'Review instead of rewrite'], tools: ['ChatGPT Projects', 'Claude Projects'], outcome: 'Five reusable prompt templates', durationLabel: '2 hours', order: 1 },
  { dayNumber: 3, title: 'AI for Sales, Enquiries and Lead Generation', subtitle: 'Faster response, better follow-up', phase: 'Revenue', icon: 'phone-call', description: 'Shorten enquiry-to-quotation: intake summaries, qualification, tailored proposals and a follow-up sequence that never forgets.', learningObjectives: ['Turn enquiries into structured briefs', 'Generate tailored proposals', 'Design a multi-touch follow-up', 'Build a lead research routine'], tools: ['ChatGPT', 'Google Sheets', 'Gmail'], outcome: 'A working enquiry-to-proposal workflow', durationLabel: '2 hours', order: 2 },
  { dayNumber: 4, title: 'AI for Marketing and Content Production', subtitle: 'A month of content in one sitting', phase: 'Revenue', icon: 'megaphone', description: 'Positioning, message pillars, then batch production for social, email and web — plus visuals.', learningObjectives: ['Define message pillars AI can use', 'Batch-produce a month of content', 'Create visuals and short-form assets', 'Repurpose one long asset'], tools: ['ChatGPT', 'Canva AI', 'CapCut'], outcome: 'A 30-day content bank', durationLabel: '2 hours', order: 3 },
  { dayNumber: 5, title: 'AI for Customer Support and Communication', subtitle: 'Consistent answers, calmer inbox', phase: 'Operations', icon: 'messages-square', description: 'Turn policies and past replies into a knowledge base, then assisted replies for WhatsApp and email.', learningObjectives: ['Build a support knowledge base', 'Create assisted reply workflows', 'Set escalation rules', 'Measure response time'], tools: ['ChatGPT', 'WhatsApp Business'], outcome: 'An assisted support workflow', durationLabel: '2 hours', order: 4 },
  { dayNumber: 6, title: 'AI for Operations, SOPs and Documentation', subtitle: 'Getting the business out of your head', phase: 'Operations', icon: 'clipboard-list', description: 'Convert recordings and messy instructions into SOPs, checklists and training material.', learningObjectives: ['Turn meetings into SOPs', 'Generate role-wise checklists', 'Standardise recurring documents', 'Keep docs current without a dedicated person'], tools: ['ChatGPT', 'Google Docs'], outcome: 'Three documented SOPs', durationLabel: '2 hours', order: 5 },
  { dayNumber: 7, title: 'AI for Finance, Reporting and Decisions', subtitle: 'Numbers that explain themselves', phase: 'Operations', icon: 'bar-chart-3', description: 'Read operational data and produce the summaries you actually forward to the team.', learningObjectives: ['Analyse sheets safely with AI', 'Generate recurring summaries', 'Extract invoices into structured data', 'Build a fifteen-minute weekly review'], tools: ['ChatGPT', 'Google Sheets'], outcome: 'An automated weekly management report', durationLabel: '2 hours', order: 6 },
  { dayNumber: 8, title: 'Automation Without Code', subtitle: 'Connecting AI to tools you already use', phase: 'Automation', icon: 'workflow', description: 'Wire AI into forms, sheets, inbox and messaging so workflows trigger themselves.', learningObjectives: ['Understand triggers and conditions', 'Connect AI steps into live workflows', 'Add error handling and human checkpoints', 'Deploy two automations end to end'], tools: ['Make', 'n8n', 'Zapier'], outcome: 'Two live automations', durationLabel: '2 hours', order: 7 },
  { dayNumber: 9, title: 'Custom AI Assistants and Knowledge Base', subtitle: 'An assistant that knows your business', phase: 'Automation', icon: 'bot', description: 'Private assistants trained on catalogues, pricing, policies and past proposals.', learningObjectives: ['Structure company knowledge', 'Build role-specific assistants', 'Set confidentiality boundaries', 'Roll out with usage guidelines'], tools: ['Custom GPTs', 'Claude Projects'], outcome: 'Two custom assistants', durationLabel: '2 hours', order: 8 },
  { dayNumber: 10, title: '90-Day AI Roadmap and Team Rollout', subtitle: 'Making it permanent', phase: 'Scale', icon: 'rocket', description: 'Convert ten days of building into a plan: what runs now, who owns it, what you measure.', learningObjectives: ['Document a system map', 'Assign ownership and cadence', 'Define time and cost metrics', 'Plan the next ninety days'], tools: ['Roadmap template', 'SOP library'], outcome: 'A written 90-day roadmap', durationLabel: '2 hours', isHighlighted: true, order: 9 },
];

export const bonusesSeed = [
  { title: 'AI Prompt Vault for Business Owners', subtitle: '150+ tested prompts', description: 'Organised by function. Each prompt includes context and output format.', actualValue: 7500, displayValue: '₹7,500', icon: 'library', badge: 'Most used', isFeatured: true, order: 0 },
  { title: 'Automation Blueprint Library', subtitle: '12 ready-to-deploy maps', description: 'Enquiry routing, follow-up, invoice extraction, weekly reporting.', actualValue: 6000, displayValue: '₹6,000', icon: 'git-branch', isFeatured: true, order: 1 },
  { title: 'Tool Stack and Cost Calculator', description: 'Honest monthly costs, free-tier limits, and a model of your own stack.', actualValue: 4000, displayValue: '₹4,000', icon: 'calculator', order: 2 },
  { title: '30-Day Implementation Tracker', description: 'Day-by-day tracker, SOP templates and adoption checklists.', actualValue: 3500, displayValue: '₹3,500', icon: 'clipboard-check', order: 3 },
  { title: 'Session recordings and owners’ circle', description: 'Full recordings for the batch duration plus a private working group.', actualValue: 4000, displayValue: '₹4,000', icon: 'users', order: 4 },
];

export const testimonialsSeed = [
  { name: 'Rohit Agarwal', role: 'Founder', company: 'Precision Components', quote: 'Quotations went from three days to a two-hour job with better formatting. The sessions are practical to the point of being blunt.', highlight: 'Quotation cycle cut from 3 days to 2 hours', resultMetric: '~18 hours saved / month', rating: 5, isFeatured: true, order: 0 },
  { name: 'Sneha Kulkarni', role: 'Director', company: 'Kulkarni Textiles', quote: 'I expected theory and left with two automations running. The follow-up system recovered enquiries we were quietly losing.', highlight: 'Two live automations by day eight', rating: 5, isFeatured: true, order: 1 },
  { name: 'Imran Shaikh', role: 'Managing Partner', company: 'Shaikh Logistics', quote: 'Our SOPs used to live in my head. Now they live in a shared library that new joiners actually read.', highlight: 'Team onboarding time halved', rating: 5, order: 2 },
  { name: 'Priya Menon', role: 'Co-founder', company: 'Studio Nine Interiors', quote: 'We now produce a month of posts in one sitting and it still sounds like our studio.', highlight: 'A month of content in one sitting', rating: 5, order: 3 },
  { name: 'Vikram Desai', role: 'Owner', company: 'Desai Electricals', quote: 'Being told what not to automate saved me from wasting money on tools I did not need.', highlight: 'Clear decisions on where AI pays', rating: 5, order: 4 },
  { name: 'Anita Raghavan', role: 'CEO', company: 'Bluecrest Consulting', quote: 'The weekly management report arrives every Monday without anyone touching it. That workflow paid for the workshop.', highlight: 'Automated weekly reporting', rating: 5, order: 5 },
];

export const faqsSeed = [
  { question: 'Who is this workshop for?', answer: 'Owners, founders and decision makers who want AI working inside the business. Manufacturers, traders, service firms, professionals and consultants with repeatable work.', category: 'General', isFeatured: true, order: 0 },
  { question: 'Do I need technical knowledge?', answer: 'No. There is no coding. If you can use WhatsApp, email and a spreadsheet, you can follow every session. Configuration is done together on screen.', category: 'General', isFeatured: true, order: 1 },
  { question: 'How are sessions conducted?', answer: 'Ten live Zoom sessions, 8:00–10:00 PM IST, 1.5–2 hours of guided implementation with questions in the room.', category: 'Format', order: 2 },
  { question: 'What if I miss a session?', answer: 'Recordings are available for the batch duration. Watch within twenty-four hours so the sequence stays intact.', category: 'Format', order: 3 },
  { question: 'How do I book?', answer: 'Use Secure Your Seat. You choose the workshop, enter details, review, and pay through Razorpay. A registration ID is issued after payment is verified on our server — there is no Google Form.', category: 'Registration', isFeatured: true, order: 4 },
  { question: 'How many seats?', answer: 'Thirty. The batch is kept small so every business gets attention. Remaining seats are the real remaining seats.', category: 'Registration', isFeatured: true, order: 5 },
  { question: 'What is the investment?', answer: 'Founding batch is ₹10,000. Next batch is ₹15,000. Bonuses worth ₹25,000+ are included.', category: 'Registration', order: 6 },
  { question: 'Will this work for my industry?', answer: 'Enquiries, proposals, follow-ups, support, documentation, reporting and automation exist in almost every business. If you are unsure, WhatsApp us with a short description.', category: 'General', order: 7 },
];

export const contactsSeed = [
  { name: 'Arpit', role: 'Workshop coordinator', phone: '+91 98792 08321', whatsappNumber: '919879208321', whatsappMessage: 'Hi Arpit, I would like to know more about the AI IN ACTION workshop.', availabilityNote: '10:00 AM – 8:00 PM IST', showCallButton: true, showWhatsappButton: true, order: 0 },
  { name: 'Gourishankar', role: 'Workshop coordinator', phone: '+91 83077 02567', whatsappNumber: '918307702567', whatsappMessage: 'Hi Gourishankar, I would like to know more about the AI IN ACTION workshop.', availabilityNote: '10:00 AM – 8:00 PM IST', showCallButton: true, showWhatsappButton: true, order: 1 },
];

export const speakersSeed = [
  { name: 'Lead implementer', role: 'Workshop trainer', bio: 'Installs AI workflows inside operating businesses — sales, operations and reporting — without asking owners to become engineers. Replace this bio from the CMS.', order: 0 },
];

export const gallerySeed = [
  {
    title: 'AI quotation pipeline live',
    description: 'From raw enquiry to draft proposal in under two minutes — human approval only.',
    category: 'demo' as const,
    media: {
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      kind: 'video' as const,
      alt: 'AI quotation automation demo',
      posterUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1280&q=80',
      provider: 'external' as const,
    },
    order: 0,
  },
  {
    title: 'WhatsApp follow-up engine',
    description: 'AI drafts replies; you approve. Nothing sends without you.',
    category: 'ai-action' as const,
    media: {
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      kind: 'video' as const,
      alt: 'AI follow-up workflow',
      posterUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1280&q=80',
      provider: 'external' as const,
    },
    order: 1,
  },
  {
    title: 'Weekly numbers on autopilot',
    description: 'Sheets in → summary out → action items assigned.',
    category: 'workshop' as const,
    media: {
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      kind: 'video' as const,
      alt: 'AI reporting automation',
      posterUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1280&q=80',
      provider: 'external' as const,
    },
    order: 2,
  },
  {
    title: 'Live batch — Day 3 build',
    description: 'Owners shipping a real workflow before the session ends.',
    category: 'workshop' as const,
    media: {
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
      kind: 'video' as const,
      alt: 'Workshop live session',
      posterUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1280&q=80',
      provider: 'external' as const,
    },
    order: 3,
  },
  {
    title: 'Support inbox triage',
    description: 'Classify, draft, escalate — repeatable support ops with AI.',
    category: 'demo' as const,
    media: {
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      kind: 'video' as const,
      alt: 'AI support triage',
      posterUrl: 'https://images.unsplash.com/photo-1535378918492-87326691a9a1?w=1280&q=80',
      provider: 'external' as const,
    },
    order: 4,
  },
  {
    title: 'Owner Q&A — AI in operations',
    description: 'Real questions from the founding batch on implementation.',
    category: 'ai-action' as const,
    media: {
      url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      kind: 'video' as const,
      alt: 'Workshop Q&A',
      posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1280&q=80',
      provider: 'external' as const,
    },
    order: 5,
  },
];
