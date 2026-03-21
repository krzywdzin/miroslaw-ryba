import { useEffect, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal } from 'lucide-react'
import { toast } from 'sonner'

import {
  simulationSchema,
  type SimulationFormValues,
} from '../schemas/config.schema'
import { useConfigStore } from '../hooks/useConfigStore'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export function SimulationSection() {
  const { t } = useTranslation('settings')
  const config = useConfigStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues: {
      agentCount: config.agentCount,
      maxRounds: config.maxRounds,
      enableTwitter: config.enableTwitter,
      enableReddit: config.enableReddit,
    },
    mode: 'onBlur',
  })

  const watchedValues = form.watch()
  const saveConfig = useCallback(
    (values: SimulationFormValues) => {
      config.setConfig(values)
      toast.success(t('feedback.saved'), { duration: 1500 })
    },
    [config, t]
  )

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // Trigger validation to check platform refine rule
      form.trigger().then((isValid) => {
        if (isValid && form.formState.isDirty) {
          saveConfig(watchedValues)
        }
      })
    }, 500)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [watchedValues, form.formState.isDirty, saveConfig, form])

  return (
    <section id="simulation">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-[22px] font-semibold">
              {t('sections.simulation.heading')}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="agentCount"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        {t('sections.simulation.agentCount')}
                      </FormLabel>
                      <Badge variant="default">{field.value}</Badge>
                    </div>
                    <FormControl>
                      <Slider
                        min={2}
                        max={50}
                        value={[field.value]}
                        onValueChange={([val]) =>
                          field.onChange(val)
                        }
                        className="py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxRounds"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>
                        {t('sections.simulation.maxRounds')}
                      </FormLabel>
                      <Badge variant="default">{field.value}</Badge>
                    </div>
                    <FormControl>
                      <Slider
                        min={1}
                        max={20}
                        value={[field.value]}
                        onValueChange={([val]) =>
                          field.onChange(val)
                        }
                        className="py-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <Label className="text-[13px] font-semibold">
                  {t('sections.simulation.platforms')}
                </Label>
                <div className="flex items-center gap-6">
                  <FormField
                    control={form.control}
                    name="enableTwitter"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label className="!mt-0 cursor-pointer">
                          {t('sections.simulation.twitter')}
                        </Label>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="enableReddit"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <Label className="!mt-0 cursor-pointer">
                          {t('sections.simulation.reddit')}
                        </Label>
                      </FormItem>
                    )}
                  />
                </div>

                {form.formState.errors.enableReddit && (
                  <p className="text-[13px] text-destructive">
                    {t('sections.simulation.platformError')}
                  </p>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  )
}
