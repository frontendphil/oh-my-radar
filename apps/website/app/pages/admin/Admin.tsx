import invariant from "invariant"
import { RadarChart, Selection } from "@radar/chart"
import { useParams, useTransition } from "@remix-run/react"
import { useEffect } from "react"

import {
  Button,
  Form,
  FormGroup,
  Input,
  NumberInput,
} from "../../form-controls"
import { useConfiguration } from "./useConfiguration"
import { Dimensions } from "./Dimensions"
import { Canvas, Divider, SidePanel, View } from "../../layout"
import { AdminGetChartQuery } from "../../api/admin"

type Props = {
  initialConfiguration: AdminGetChartQuery
}

export const Admin = ({ initialConfiguration }: Props) => {
  const { id } = useParams()

  const [configuration, updateConfiguration] = useConfiguration()

  useEffect(() => {
    if (!initialConfiguration?.charts_by_pk) {
      return
    }

    const { title, min, max, dimensions } = initialConfiguration.charts_by_pk

    updateConfiguration({
      title,
      dimensions,
      range: [min, max],
    })
  }, [initialConfiguration?.charts_by_pk, updateConfiguration])

  invariant(initialConfiguration?.charts_by_pk, "Could not load chart data")

  const { title, dimensions, range } = configuration

  const [min, max] = range

  return (
    <View>
      <Canvas>
        <RadarChart title={title} dimensions={dimensions} range={range}>
          <Selection active name="example" />
        </RadarChart>
      </Canvas>
      <SidePanel>
        <div className="flex flex-col gap-8">
          <Form>
            <Input
              label="Title"
              name="title"
              value={title}
              onChange={(title) => updateConfiguration({ title })}
            />

            <FormGroup>
              <NumberInput
                label="Min value"
                name="min"
                value={min}
                isValid={(value) =>
                  value < max
                    ? [true]
                    : [false, `Min value must be less than ${max}`]
                }
                onChange={(value) =>
                  updateConfiguration({
                    range: [value, max],
                  })
                }
              />

              <NumberInput
                label="Max value"
                name="max"
                value={max}
                isValid={(value) =>
                  value > min
                    ? [true]
                    : [false, `Max value must be greater than ${min}`]
                }
                onChange={(value) =>
                  updateConfiguration({
                    range: [min, value],
                  })
                }
              />
            </FormGroup>

            <Button type="submit" name="action" value="update-chart">
              Save
            </Button>
          </Form>

          <Dimensions dimensions={dimensions} />
        </div>

        <Divider />

        <div className="flex flex-col gap-10">
          <Input
            disabled
            label="Participant view"
            hint="Give this link to the people who should fill out this chart."
            value={getLink(`/participate/${id}`)}
          />

          <Input
            disabled
            label="Results view"
            hint="Use this link to see all answers that have been submitted. Everyone with this link can see the results."
            value={getLink(`/results/${id}`)}
          />
        </div>
      </SidePanel>
    </View>
  )
}

const getLink = (to: string) => {
  if (typeof document === "undefined") {
    return to
  }

  return `${location.origin}${to}`
}
