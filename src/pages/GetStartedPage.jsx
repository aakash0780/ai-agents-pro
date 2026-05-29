import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Building2, CheckCircle2, ClipboardList, Loader2, Network, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Seo } from '@/components/SEO';
import { SITE_NAME } from '@/constants/site';
import { leadsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

const industryOptions = [
  'SaaS / Software',
  'E-commerce',
  'Healthcare',
  'Real Estate',
  'Finance / Insurance',
  'Education',
  'Agency / Consulting',
  'Other',
];

const companySizeOptions = ['1–10', '11–50', '51–200', '201–500', '500+'];

const primaryGoalOptions = [
  'Generate more leads',
  'Respond faster to customers',
  'Reduce support cost',
  'Automate WhatsApp conversations',
  'Automate voice calls',
  'Improve customer retention',
  'Build a custom AI agent',
];

const currentToolsOptions = [
  'HubSpot',
  'Salesforce',
  'Zoho CRM',
  'WhatsApp',
  'Slack',
  'Zendesk',
  'Shopify',
  'Twilio',
  'Other',
];

const volumeOptions = [
  'Under 100/month',
  '100–500/month',
  '500–2,000/month',
  '2,000–10,000/month',
  '10,000+/month',
];

const contactMethodOptions = ['Email', 'Phone', 'WhatsApp', 'Video call'];

/** Align ?integration= query with "Current tools" checkbox labels */
const INTEGRATION_PARAM_TO_TOOL = {
  hubspot: 'HubSpot',
  salesforce: 'Salesforce',
  zoho: 'Zoho CRM',
  whatsapp: 'WhatsApp',
  slack: 'Slack',
  zendesk: 'Zendesk',
  shopify: 'Shopify',
  twilio: 'Twilio',
};

const formSteps = [
  { label: 'Contact', description: 'Who should we reach?' },
  { label: 'Company', description: 'What business are we mapping?' },
  { label: 'Workflow', description: 'Where can automation help first?' },
];

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  companyName: '',
  companyWebsite: '',
  industry: '',
  companySize: '',
  primaryGoal: '',
  currentTools: [],
  conversationVolume: '',
  biggestChallenge: '',
  preferredContactMethod: '',
  message: '',
};

function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

function isValidWebsite(website) {
  if (!website.trim()) return true;

  try {
    const withScheme = /^https?:\/\//i.test(website) ? website : `https://${website}`;
    const url = new URL(withScheme);
    return Boolean(url.hostname);
  } catch {
    return false;
  }
}

export function GetStartedPage() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const [submittedLeadId, setSubmittedLeadId] = useState('');

  const integrationParam = searchParams.get('integration');

  useEffect(() => {
    const key = integrationParam?.toLowerCase();
    const toolLabel = key ? INTEGRATION_PARAM_TO_TOOL[key] : undefined;
    if (!toolLabel) return;

    setFormData((previous) =>
      previous.currentTools.includes(toolLabel)
        ? previous
        : { ...previous, currentTools: [...previous.currentTools, toolLabel] },
    );
  }, [integrationParam]);

  const hasSuccess = useMemo(() => Boolean(submittedLeadId), [submittedLeadId]);

  const setField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
    if (submissionError) setSubmissionError('');
  };

  const toggleTool = (tool) => {
    setFormData((current) => {
      const exists = current.currentTools.includes(tool);
      return {
        ...current,
        currentTools: exists
          ? current.currentTools.filter((item) => item !== tool)
          : [...current.currentTools, tool],
      };
    });
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!formData.email.trim()) {
      nextErrors.email = 'Work email is required.';
    } else if (!isValidEmail(formData.email)) {
      nextErrors.email = 'Enter a valid work email.';
    }
    if (!formData.companyName.trim()) nextErrors.companyName = 'Company name is required.';
    if (!formData.primaryGoal.trim()) nextErrors.primaryGoal = 'Primary goal is required.';
    if (!formData.biggestChallenge.trim()) nextErrors.biggestChallenge = 'Biggest automation challenge is required.';
    if (!isValidWebsite(formData.companyWebsite)) nextErrors.companyWebsite = 'Enter a valid company website URL.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError('');

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        companyName: formData.companyName.trim(),
        companyWebsite: formData.companyWebsite.trim() || undefined,
        industry: formData.industry || undefined,
        companySize: formData.companySize || undefined,
        primaryGoal: formData.primaryGoal,
        currentTools: formData.currentTools,
        conversationVolume: formData.conversationVolume || undefined,
        biggestChallenge: formData.biggestChallenge.trim(),
        preferredContactMethod: formData.preferredContactMethod || undefined,
        message: formData.message.trim() || undefined,
      };

      const { lead } = await leadsAPI.submit(payload);
      setSubmittedLeadId(lead?.id || 'submitted');
    } catch (error) {
      setSubmissionError(error?.message || 'Unable to submit right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasSuccess) {
    return (
      <div className="relative overflow-hidden bg-[#050507] pt-24 pb-16 text-[#f2f2f2]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <span className="absolute left-[10%] top-32 h-2 w-2 rounded-full bg-[#00d992] shadow-[0_0_18px_#00d992]" />
          <span className="absolute right-[12%] top-28 h-48 w-48 rounded-full border border-[#00d992]/10 shadow-[0_0_70px_rgba(0,217,146,0.08)]" />
          <span className="absolute bottom-16 left-[14%] h-px w-56 bg-gradient-to-r from-transparent via-[#00d992]/35 to-transparent" />
        </div>
        <Seo
          title={`Get Started | ${SITE_NAME}`}
          description="Get started with AI Agents Pro by sharing a few details about your company."
          canonicalPath="/get-started"
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Card className="border-[#3d3a39] bg-[#101010]/95 shadow-[0_24px_80px_rgba(0,0,0,0.45),rgba(92,88,85,0.2)_0_0_18px] backdrop-blur">
            <CardContent className="py-12 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#3d3a39] bg-[#050507]">
                <CheckCircle2 className="h-8 w-8 text-[#00d992]" />
              </div>
              <h1 className="font-[system-ui] text-3xl font-semibold text-[#f2f2f2]">
                Thanks. We received your details.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#b8b3b0]">
                We will review your goals and current setup, then share a recommended automation rollout for your business.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    setFormData(initialForm);
                    setErrors({});
                    setSubmittedLeadId('');
                    setSubmissionError('');
                  }}
                  className="rounded-md border border-[#3d3a39] bg-[#101010] px-5 py-3 text-[#2fd6a1] hover:bg-black/20"
                >
                  Submit another response
                </Button>
                <Button asChild variant="ghost" className="rounded-md border border-[#3d3a39] bg-[#101010] px-5 py-3 text-[#f2f2f2] hover:bg-black/20">
                  <Link to="/">Back to home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#050507] pt-24 pb-16 text-[#f2f2f2]">
      <Seo
        title={`Get Started | ${SITE_NAME}`}
        description="Share your company details and automation needs to get a tailored AI Agents Pro launch plan."
        canonicalPath="/get-started"
      />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute left-[6%] top-28 h-px w-64 bg-gradient-to-r from-transparent via-[#00d992]/40 to-transparent" />
        <span className="absolute right-[9%] top-24 h-56 w-56 rounded-full border border-[#00d992]/10 shadow-[0_0_70px_rgba(0,217,146,0.07)]" />
        <span className="absolute bottom-24 left-[8%] h-14 w-14 border border-[#00d992]/20 bg-[#101010]/70 [transform:rotateX(58deg)_rotateZ(42deg)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button asChild variant="ghost" className="-ml-2 mb-5 gap-2 text-[#8b949e] hover:bg-transparent hover:text-[#f2f2f2]">
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </Button>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="relative overflow-hidden rounded-lg border border-[#3d3a39] bg-[#101010]/90 p-7 shadow-[rgba(92,88,85,0.2)_0_0_16px] backdrop-blur lg:sticky lg:top-24 lg:self-start">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(0,217,146,0.22),transparent_50%),radial-gradient(circle_at_85%_75%,rgba(87,108,255,0.12),transparent_46%)]" aria-hidden="true" />
            <div className="relative">
              <p className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#00d992]">Intake Brief</p>
              <h1 className="mt-4 font-[system-ui] text-[34px] leading-[1.05] tracking-[-0.5px] text-[#f2f2f2] sm:text-[40px]">
                Get started with a few details about your company.
              </h1>
              <p className="mt-5 text-base leading-7 text-[#b8b3b0]">
                Tell us what you want to automate, which tools you already use, and where customer conversations happen today. We’ll use this to recommend the right AI agent setup for your business.
              </p>

              <div className="mt-8 space-y-3">
                {[
                  'Lead and support workflow assessment',
                  'Channel and tooling fit recommendation',
                  'Automation ROI opportunity estimate',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-md border border-[#3d3a39] bg-[#0a0a0a]/80 px-4 py-3">
                    <Sparkles className="mt-0.5 h-4 w-4 text-[#00d992]" />
                    <span className="text-sm text-[#c8c3bf]">{item}</span>
                  </div>
                ))}
              </div>

              <div className="relative mt-8 h-[190px] overflow-hidden rounded-md border border-[#3d3a39] bg-[#050507]">
                <div className="absolute left-6 top-6 flex items-center gap-2 rounded-full border border-[#00d992]/25 bg-[#0d1512]/80 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[#00d992]">
                  <Network className="h-3.5 w-3.5" />
                  Agent map
                </div>
                <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-[#00d992] shadow-[0_0_16px_#00d992]" />
                <div className="absolute right-8 top-12 h-2 w-2 rounded-full bg-[#74f8d2] shadow-[0_0_14px_#74f8d2]" />
                <div className="absolute bottom-6 left-10 h-2 w-2 rounded-full bg-[#2bd3a7] shadow-[0_0_14px_#2bd3a7]" />
                <div className="absolute left-6 top-8 h-px w-[72%] bg-gradient-to-r from-[#00d992]/40 to-transparent" />
                <div className="absolute right-6 top-12 h-[56%] w-px bg-gradient-to-b from-[#00d992]/35 to-transparent" />
                <div className="absolute left-12 bottom-10 h-px w-[52%] bg-gradient-to-r from-[#74f8d2]/45 to-transparent" />
                <div className="absolute right-10 bottom-8 h-12 w-12 rounded-lg border border-[#3d3a39] bg-[#0b1210]/90 [transform:rotateX(55deg)_rotateZ(22deg)]" />
              </div>
            </div>
          </aside>

          <Card className="border-[#3d3a39] bg-[#101010]/92 shadow-[0_24px_70px_rgba(0,0,0,0.42),rgba(92,88,85,0.2)_0_0_18px] backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-2xl text-[#f2f2f2]">
                <Building2 className="h-5 w-5 text-[#00d992]" />
                Company Details
              </CardTitle>
              <CardDescription className="text-[#8b949e]">Fields marked with * are required.</CardDescription>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {formSteps.map((step, index) => (
                  <div key={step.label} className="rounded-md border border-[#3d3a39] bg-[#050507]/70 p-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#f2f2f2]">
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[#00d992] text-xs text-[#050507]">
                        {index + 1}
                      </span>
                      {step.label}
                    </div>
                    <p className="mt-2 text-xs leading-5 text-[#8b949e]">{step.description}</p>
                  </div>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {submissionError ? (
                  <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {submissionError}
                  </div>
                ) : null}

                <fieldset className="space-y-4 border-0 border-b border-[#3d3a39]/80 pb-6">
                  <legend className="mb-1 text-sm font-semibold text-[#f2f2f2]">Contact</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full name *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setField('fullName', e.target.value)}
                        className={cn('h-11 border-[#3d3a39] bg-[#050507] text-[#f2f2f2]', errors.fullName && 'border-red-400')}
                      />
                      {errors.fullName ? <p className="text-xs text-red-300">{errors.fullName}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Work email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setField('email', e.target.value)}
                        className={cn('h-11 border-[#3d3a39] bg-[#050507] text-[#f2f2f2]', errors.email && 'border-red-400')}
                      />
                      {errors.email ? <p className="text-xs text-red-300">{errors.email}</p> : null}
                    </div>
                  </div>
                  <div className="max-w-md space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      className="h-11 border-[#3d3a39] bg-[#050507] text-[#f2f2f2]"
                    />
                  </div>
                </fieldset>

                <fieldset className="space-y-4 border-0 border-b border-[#3d3a39]/80 pb-6">
                  <legend className="mb-1 text-sm font-semibold text-[#f2f2f2]">Company</legend>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company name *</Label>
                      <Input
                        id="companyName"
                        value={formData.companyName}
                        onChange={(e) => setField('companyName', e.target.value)}
                        className={cn('h-11 border-[#3d3a39] bg-[#050507] text-[#f2f2f2]', errors.companyName && 'border-red-400')}
                      />
                      {errors.companyName ? <p className="text-xs text-red-300">{errors.companyName}</p> : null}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company website</Label>
                      <Input
                        id="companyWebsite"
                        placeholder="https://example.com"
                        value={formData.companyWebsite}
                        onChange={(e) => setField('companyWebsite', e.target.value)}
                        className={cn('h-11 border-[#3d3a39] bg-[#050507] text-[#f2f2f2]', errors.companyWebsite && 'border-red-400')}
                      />
                      {errors.companyWebsite ? <p className="text-xs text-red-300">{errors.companyWebsite}</p> : null}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select value={formData.industry} onValueChange={(value) => setField('industry', value)}>
                        <SelectTrigger
                          id="industry"
                          className="h-11 w-full border-[#3d3a39] bg-[#050507] text-[#f2f2f2] data-[placeholder]:text-[#8b949e]"
                        >
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent className="border-[#3d3a39] bg-[#101010] text-[#f2f2f2]">
                          {industryOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="companySize">Company size</Label>
                      <Select value={formData.companySize} onValueChange={(value) => setField('companySize', value)}>
                        <SelectTrigger
                          id="companySize"
                          className="h-11 w-full border-[#3d3a39] bg-[#050507] text-[#f2f2f2] data-[placeholder]:text-[#8b949e]"
                        >
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent className="border-[#3d3a39] bg-[#101010] text-[#f2f2f2]">
                          {companySizeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </fieldset>

                <fieldset className="space-y-5 border-0 border-b border-[#3d3a39]/80 pb-6">
                  <legend className="mb-1 text-sm font-semibold text-[#f2f2f2]">Automation focus</legend>
                  <p className="text-sm leading-6 text-[#8b949e]">
                    Pick the strongest first use case. We use this to recommend the first agent workflow and integrations.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="primaryGoal">Primary goal *</Label>
                    <Select value={formData.primaryGoal} onValueChange={(value) => setField('primaryGoal', value)}>
                      <SelectTrigger
                        id="primaryGoal"
                        aria-invalid={Boolean(errors.primaryGoal)}
                        className={cn(
                          'h-11 w-full border bg-[#050507] text-[#f2f2f2] data-[placeholder]:text-[#8b949e]',
                          errors.primaryGoal ? 'border-red-400 aria-invalid:border-red-400' : 'border-[#3d3a39]',
                        )}
                      >
                        <SelectValue placeholder="Select primary goal" />
                      </SelectTrigger>
                      <SelectContent className="border-[#3d3a39] bg-[#101010] text-[#f2f2f2]">
                        {primaryGoalOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.primaryGoal ? <p className="text-xs text-red-300">{errors.primaryGoal}</p> : null}
                  </div>
                </fieldset>

                <fieldset className="space-y-5 border-0 border-b border-[#3d3a39]/80 pb-6">
                  <legend className="flex items-center gap-2 text-sm font-semibold text-[#f2f2f2]">
                    <ClipboardList className="h-4 w-4 text-[#00d992]" />
                    Workflow context
                  </legend>
                  <p className="text-sm leading-6 text-[#8b949e]">
                    Tell us where customer conversations happen today and what systems the agent should update.
                  </p>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-[#f2f2f2]">Current tools used</p>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {currentToolsOptions.map((tool) => {
                        const checked = formData.currentTools.includes(tool);
                        return (
                          <label
                            key={tool}
                            htmlFor={`tool-${tool.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                            className={cn(
                              'flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors',
                              checked
                                ? 'border-[#00d992] bg-[#0d1512] text-[#d8fff2]'
                                : 'border-[#3d3a39] bg-[#050507] text-[#c8c3bf]',
                            )}
                          >
                            <Checkbox
                              id={`tool-${tool.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                              checked={checked}
                              onCheckedChange={() => toggleTool(tool)}
                              className="border-[#3d3a39] data-[state=checked]:border-[#00d992] data-[state=checked]:bg-[#00d992] data-[state=checked]:text-[#050507]"
                            />
                            <span>{tool}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="conversationVolume">Monthly customer conversation volume</Label>
                      <Select value={formData.conversationVolume} onValueChange={(value) => setField('conversationVolume', value)}>
                        <SelectTrigger
                          id="conversationVolume"
                          className="h-11 w-full border-[#3d3a39] bg-[#050507] text-[#f2f2f2] data-[placeholder]:text-[#8b949e]"
                        >
                          <SelectValue placeholder="Select conversation volume" />
                        </SelectTrigger>
                        <SelectContent className="border-[#3d3a39] bg-[#101010] text-[#f2f2f2]">
                          {volumeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="preferredContactMethod">Preferred contact method</Label>
                      <Select
                        value={formData.preferredContactMethod}
                        onValueChange={(value) => setField('preferredContactMethod', value)}
                      >
                        <SelectTrigger
                          id="preferredContactMethod"
                          className="h-11 w-full border-[#3d3a39] bg-[#050507] text-[#f2f2f2] data-[placeholder]:text-[#8b949e]"
                        >
                          <SelectValue placeholder="Select preferred contact method" />
                        </SelectTrigger>
                        <SelectContent className="border-[#3d3a39] bg-[#101010] text-[#f2f2f2]">
                          {contactMethodOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="biggestChallenge">Biggest automation challenge *</Label>
                    <Textarea
                      id="biggestChallenge"
                      rows={4}
                      value={formData.biggestChallenge}
                      onChange={(e) => setField('biggestChallenge', e.target.value)}
                      placeholder="Describe the main bottleneck in your sales/support workflow."
                      className={cn('border-[#3d3a39] bg-[#050507] text-[#f2f2f2]', errors.biggestChallenge && 'border-red-400')}
                    />
                    {errors.biggestChallenge ? <p className="text-xs text-red-300">{errors.biggestChallenge}</p> : null}
                  </div>
                </fieldset>

                <fieldset className="space-y-3 border-0">
                  <legend className="text-sm font-semibold text-[#f2f2f2]">Final note</legend>
                  <div className="space-y-2">
                    <Label htmlFor="message">Optional message</Label>
                    <Textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setField('message', e.target.value)}
                      placeholder="Anything else we should know before reaching out?"
                      className="border-[#3d3a39] bg-[#050507] text-[#f2f2f2]"
                    />
                  </div>
                </fieldset>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-md border border-[#00d992]/60 bg-[#00d992] text-sm font-semibold text-[#050507] shadow-[0_0_28px_rgba(0,217,146,0.22)] hover:bg-[#2fd6a1] disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting details...
                    </>
                  ) : (
                    'Submit details'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
