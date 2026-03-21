import { useTranslation } from 'react-i18next'
import { Container } from 'lucide-react'

import { useDockerStatus } from '../hooks/useDockerStatus'
import { ComposeControls } from './docker/ComposeControls'
import { ContainerList } from './docker/ContainerList'
import { ContainerLogs } from './docker/ContainerLogs'
import { ContainerResources } from './docker/ContainerResources'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

export function DockerSection() {
  const { t } = useTranslation('settings')
  const { containers, isLoading, isError } = useDockerStatus()

  return (
    <section id="docker">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Container className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-[22px] font-semibold">
              {t('sections.docker.heading')}
            </h2>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="containers">
            <TabsList>
              <TabsTrigger value="containers">Kontenery</TabsTrigger>
              <TabsTrigger value="logs">Logi</TabsTrigger>
              <TabsTrigger value="resources">Zasoby</TabsTrigger>
            </TabsList>

            <TabsContent value="containers">
              <div className="space-y-4">
                <ComposeControls />
                <ContainerList
                  containers={containers}
                  isLoading={isLoading}
                  isError={isError}
                />
              </div>
            </TabsContent>

            <TabsContent value="logs">
              <ContainerLogs containers={containers} />
            </TabsContent>

            <TabsContent value="resources">
              <ContainerResources containers={containers} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  )
}
