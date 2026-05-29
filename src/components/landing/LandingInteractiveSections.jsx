import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { CheckCircle2 } from 'lucide-react'

export function LandingInteractiveSections({
  industryTabs,
  testimonials,
  integrationCards,
  faqItems,
  onFaqExpand,
}) {
  return (
    <>
      <section id="industries" className="scroll-mt-28 border-y border-white/10 bg-white/[0.03] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="landing-eyebrow">Industries</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Built for high-volume, high-stakes conversations
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              Each deployment is tailored to the operating reality of the vertical, not just the channel.
            </p>
          </div>

          <div className="mt-10">
            <Tabs defaultValue="ecommerce" className="gap-6">
              <TabsList className="h-auto w-full flex-wrap justify-start gap-2 rounded-[1.5rem] border border-white/10 bg-slate-950/80 p-2">
                {industryTabs.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="rounded-[1rem] border border-transparent px-4 py-3 text-sm data-[state=active]:border-cyan-300/20 data-[state=active]:bg-cyan-300/10 data-[state=active]:text-cyan-100">
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {industryTabs.map((tab) => (
                <TabsContent key={tab.value} value={tab.value}>
                  <div className="grid gap-5 lg:grid-cols-3">
                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Problem</p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                        {tab.problem.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">AI Agents Pro Solution</p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                        {tab.solution.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                    <div className="rounded-[1.75rem] border border-white/10 bg-slate-950/75 p-6">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Expected Outcome</p>
                      <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-300">
                        {tab.outcome.map((item) => <li key={item}>• {item}</li>)}
                      </ul>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="landing-eyebrow">Testimonials</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Specific outcomes, not generic praise
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              Every proof point should map back to speed, cost, or conversion impact.
            </p>
          </div>

          <div className="mt-10 px-4 sm:px-12">
            <Carousel opts={{ align: 'start', loop: true }}>
              <CarouselContent className="-ml-5">
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.company} className="pl-5 md:basis-1/2 xl:basis-1/3">
                    <div className="h-full rounded-[1.75rem] border border-white/10 bg-slate-950/80 p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold text-cyan-200">
                          {testimonial.logo}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{testimonial.company}</p>
                          <p className="text-sm text-slate-400">{testimonial.name} • {testimonial.role}</p>
                        </div>
                      </div>
                      <p className="mt-6 text-2xl font-semibold leading-tight text-white">{testimonial.result}</p>
                      <a href="#book-demo" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-cyan-200 no-underline">
                        Read full story →
                      </a>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="border-white/10 bg-slate-950 text-white hover:bg-slate-900" />
              <CarouselNext className="border-white/10 bg-slate-950 text-white hover:bg-slate-900" />
            </Carousel>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/[0.03] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="landing-eyebrow">Integrations</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Connect to the systems your team already runs on
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              Hover any integration to see the operational unlock, not just the logo.
            </p>
          </div>

          <div className="mt-10">
            <TooltipProvider>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {integrationCards.map((integration) => (
                  <Tooltip key={integration.name}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="rounded-[1.5rem] border border-white/10 bg-slate-950/80 px-5 py-7 text-center text-xl font-semibold text-white"
                      >
                        {integration.name}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs rounded-xl bg-white px-4 py-3 text-slate-950" sideOffset={10}>
                      {integration.unlocks}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </TooltipProvider>
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-28 border-y border-border bg-card/30 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="landing-eyebrow">FAQ</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Answers to the questions that slow buying decisions down
            </h2>
          </div>

          <div className="mt-10 rounded-[1.75rem] border border-border bg-card px-6 py-3 sm:px-8">
            <Accordion type="single" collapsible onValueChange={onFaqExpand}>
              {faqItems.map((item) => (
                <AccordionItem key={item.value} value={item.value} className="border-border">
                  <AccordionTrigger className="py-6 text-base font-semibold text-white hover:no-underline">{item.question}</AccordionTrigger>
                  <AccordionContent className="pb-6 text-sm leading-7 text-[#b8b3b0]">{item.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.03] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-[1.75rem] border border-[#00d992]/20 bg-[#00d992]/8 p-6 sm:p-8">
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="landing-eyebrow">Deployment CTA</p>
                <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
                  Ready to launch an agent without adding support debt?
                </h2>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                  Start with one high-value workflow, live handoff rules, and a measurable success metric.
                </p>
              </div>
              <Button asChild className="landing-primary-btn rounded-md px-6 py-3 text-base font-semibold">
                <a href="#book-demo" className="no-underline">
                  Get Your Deployment Plan
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
