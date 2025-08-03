"use client"

import type React from "react"
import { Slider, Switch, Typography, Space } from "antd"
import { useStore } from "../store/useStore"
import { format } from "date-fns"

const { Text } = Typography

export const TimelineSlider: React.FC = () => {
  const { timeRange, isRangeMode, selectedHour, setTimeRange, setIsRangeMode, setSelectedHour } = useStore()

  const minDate = timeRange.start.getTime()
  const maxDate = timeRange.end.getTime()

  const handleSliderChange = (value: number | [number, number]) => {
    if (isRangeMode) {
      if (Array.isArray(value)) {
        setTimeRange({ start: new Date(value[0]), end: new Date(value[1]) })
      }
    } else {
      if (typeof value === "number") {
        setSelectedHour(new Date(value))
      }
    }
  }

  const marks = {
    [minDate]: format(timeRange.start, "MMM dd"),
    [maxDate]: format(timeRange.end, "MMM dd"),
  }

  return (
    <div className="flex flex-col gap-4">
      <Space>
        <Text strong>Range Mode:</Text>
        <Switch checked={isRangeMode} onChange={setIsRangeMode} />
      </Space>

      <Slider
        range={isRangeMode}
        min={minDate}
        max={maxDate}
        value={isRangeMode ? [timeRange.start.getTime(), timeRange.end.getTime()] : selectedHour.getTime()}
        onChange={handleSliderChange}
        marks={marks}
        step={isRangeMode ? 3600000 * 24 : 3600000} // Daily step for range, hourly for single
        tooltip={{
          formatter: (value) => (value ? format(new Date(value), "MMM dd, HH:00") : ""),
        }}
      />

      <div className="flex justify-between">
        {isRangeMode ? (
          <Text>
            Selected Range: {format(timeRange.start, "MMM dd, HH:00")} - {format(timeRange.end, "MMM dd, HH:00")}
          </Text>
        ) : (
          <Text>Selected Hour: {format(selectedHour, "MMM dd, HH:00")}</Text>
        )}
      </div>
    </div>
  )
}
