import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'

import {
  simulationSchema,
  type SimulationFormValues,
} from '@/features/settings/schemas/config.schema'
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

interface ParameterOverrideFormProps {
  defaultValues: SimulationFormValues
  onValuesChange: (values: SimulationFormValues) => void
  visible: boolean
}

export function ParameterOverrideForm({
  defaultValues,
  onValuesChange,
  visible,
}: ParameterOverrideFormProps) {
  const { t } = useTranslation('environment')

  const form = useForm<SimulationFormValues>({
    resolver: zodResolver(simulationSchema),
    defaultValues,
    mode: 'onChange',
  })

  const watchedValues = form.watch()

  useEffect(() => {
    form.trigger().then((isValid) => {
      if (isValid) {
        onValuesChange(watchedValues)
      }
    })
  }, [
    watchedValues.agentCount,
    watchedValues.maxRounds,
    watchedValues.enableTwitter,
    watchedValues.enableReddit,
  ])

  if (!visible) return null

  return (
    <div data-testid="parameter-override-form" className="mt-4">
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="agentCount"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>{t('parameters.agentCount')}</FormLabel>
                  <Badge variant="default">{field.value}</Badge>
                </div>
                <FormControl>
                  <Slider
                    min={2}
                    max={50}
                    value={[field.value]}
                    onValueChange={([val]) => field.onChange(val)}
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
                  <FormLabel>{t('parameters.maxRounds')}</FormLabel>
                  <Badge variant="default">{field.value}</Badge>
                </div>
                <FormControl>
                  <Slider
                    min={1}
                    max={20}
                    value={[field.value]}
                    onValueChange={([val]) => field.onChange(val)}
                    className="py-2"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <Label className="text-[13px] font-semibold">
              {t('parameters.summary.platforms')}
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
                      {t('parameters.twitter')}
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
                      {t('parameters.reddit')}
                    </Label>
                  </FormItem>
                )}
              />
            </div>

            {form.formState.errors.enableReddit && (
              <p className="text-[13px] text-destructive">
                {t('parameters.platformError')}
              </p>
            )}
          </div>
        </form>
      </Form>
    </div>
  )
}
