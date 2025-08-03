"use client"

import type React from "react"
import { Slider, Switch, Typography } from "antd"
import { format, addHours, differenceInHours } from "date-fns"
import { useStore } from "../store/useStore"

const { Title, Text } = Typography

export const TimelineSlider: React.FC = () => {
  const { timeRange, isRangeMode, selectedHour, setTimeRange, setIsRangeMode, setSelectedHour } = useStore()

  const totalHours = differenceInHours(timeRange.end, timeRange.start)
  const selectedHourIndex = differenceInHours(selectedHour, timeRange.start)

  const handleSliderChange = (value: number | number[]) => {
    if (isRangeMode && Array.isArray(value)) {
      const [start, end] = value
      setTimeRange({
        start: addHours(timeRange.start, start),
        end: addHours(timeRange.start, end),
      })
    } else if (!isRangeMode && typeof value === "number") {
      setSelectedHour(addHours(timeRange.start, value))
    }
  }

  const formatTooltip = (value: number) => {
    const date = addHours(timeRange.start, value)
    return format(date, "MMM dd, HH:mm")
  }

  return (
    <div className="bg-white p-6 shadow-sm border-b">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Title level={4} className="m-0">
            Timeline Control
          </Title>
          <div className="flex items-center gap-2">
            <Text>Single Hour</Text>
            <Switch checked={isRangeMode} onChange={setIsRangeMode} size="small" />
            <Text>Range Mode</Text>
          </div>
        </div>

        <div className="mb-4">
          {isRangeMode ? (
            <Slider
              range
              min={0}
              max={totalHours}
              value={[
                differenceInHours(timeRange.start, timeRange.start),
                differenceInHours(timeRange.end, timeRange.start),
              ]}
              onChange={handleSliderChange}
              tooltip={{ formatter: formatTooltip }}
              className="mb-2"
            />
          ) : (
            <Slider
              min={0}
              max={totalHours}
              value={selectedHourIndex}
              onChange={handleSliderChange}
              tooltip={{ formatter: formatTooltip }}
              className="mb-2"
            />
          )}
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>{format(timeRange.start, "MMM dd, yyyy HH:mm")}</span>
          {isRangeMode ? (
            <span>
              Selected: {format(timeRange.start, "MMM dd HH:mm")} - {format(timeRange.end, "MMM dd HH:mm")}
            </span>
          ) : (
            <span>Selected: {format(selectedHour, "MMM dd, yyyy HH:mm")}</span>
          )}
          <span>{format(timeRange.end, "MMM dd, yyyy HH:mm")}</span>
        </div>
      </div>
    </div>
  )
}
