"use client"

import type React from "react"
import { useState } from "react"
import { Card, List, Button, Select, InputNumber, ColorPicker, Typography, Space, Divider, Popconfirm } from "antd"
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons"
import { useStore } from "../store/useStore"
import type { ColorRule } from "../types"

const { Title, Text } = Typography
const { Option } = Select

export const Sidebar: React.FC = () => {
  const { polygons, dataSources, selectedDataSource, removePolygon, addColorRule, removeColorRule, updateDataSource } =
    useStore()

  const [newRule, setNewRule] = useState<Partial<ColorRule>>({
    field: "temperature_2m",
    operator: "<",
    value: 0,
    color: "#ff4d4f",
  })

  const currentDataSource = dataSources.find((ds) => ds.id === selectedDataSource)

  const addNewColorRule = () => {
    if (newRule.field && newRule.operator && newRule.value !== undefined && newRule.color) {
      const rule: ColorRule = {
        id: `rule-${Date.now()}`,
        field: newRule.field,
        operator: newRule.operator as ColorRule["operator"],
        value: newRule.value,
        color: newRule.color,
      }

      addColorRule(selectedDataSource, rule)
      setNewRule({
        field: "temperature_2m",
        operator: "<",
        value: 0,
        color: "#ff4d4f",
      })
    }
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 p-4 overflow-y-auto">
      <Title level={4}>Control Panel</Title>

      {/* Polygons Section */}
      <Card title="Polygons" size="small" className="mb-4">
        <List
          size="small"
          dataSource={polygons}
          renderItem={(polygon) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="delete"
                  title="Delete this polygon?"
                  onConfirm={() => removePolygon(polygon.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" icon={<DeleteOutlined />} size="small" danger />
                </Popconfirm>,
              ]}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded border" style={{ backgroundColor: polygon.color }} />
                <Text ellipsis style={{ maxWidth: 150 }}>
                  {polygon.name}
                </Text>
              </div>
            </List.Item>
          )}
          locale={{ emptyText: "No polygons created yet" }}
        />
      </Card>

      {/* Data Source Configuration */}
      <Card title="Data Source Configuration" size="small" className="mb-4">
        <Space direction="vertical" className="w-full">
          <div>
            <Text strong>Current Data Source:</Text>
            <br />
            <Text>{currentDataSource?.name}</Text>
          </div>

          <Divider />

          <Text strong>Color Rules:</Text>

          {/* Existing Rules */}
          <List
            size="small"
            dataSource={currentDataSource?.colorRules || []}
            renderItem={(rule) => (
              <List.Item
                actions={[
                  <Button
                    key="delete"
                    type="text"
                    icon={<DeleteOutlined />}
                    size="small"
                    danger
                    onClick={() => removeColorRule(selectedDataSource, rule.id)}
                  />,
                ]}
              >
                <Space>
                  <div className="w-4 h-4 rounded border" style={{ backgroundColor: rule.color }} />
                  <Text>
                    {rule.field} {rule.operator} {rule.value}
                  </Text>
                </Space>
              </List.Item>
            )}
          />

          {/* Add New Rule */}
          <Card title="Add Color Rule" size="small" type="inner">
            <Space direction="vertical" className="w-full">
              <div>
                <Text>Field:</Text>
                <Select
                  value={newRule.field}
                  onChange={(value) => setNewRule({ ...newRule, field: value })}
                  className="w-full"
                >
                  {currentDataSource?.fields.map((field) => (
                    <Option key={field} value={field}>
                      {field}
                    </Option>
                  ))}
                </Select>
              </div>

              <div>
                <Text>Operator:</Text>
                <Select
                  value={newRule.operator}
                  onChange={(value) => setNewRule({ ...newRule, operator: value })}
                  className="w-full"
                >
                  <Option value="<">{"<"}</Option>
                  <Option value="<=">{"<="}</Option>
                  <Option value="=">=</Option>
                  <Option value=">=">{">="}</Option>
                  <Option value=">">{">"}</Option>
                </Select>
              </div>

              <div>
                <Text>Value:</Text>
                <InputNumber
                  value={newRule.value}
                  onChange={(value) => setNewRule({ ...newRule, value: value || 0 })}
                  className="w-full"
                />
              </div>

              <div>
                <Text>Color:</Text>
                <ColorPicker
                  value={newRule.color}
                  onChange={(color) => setNewRule({ ...newRule, color: color.toHexString() })}
                  showText
                  className="w-full"
                />
              </div>

              <Button type="primary" icon={<PlusOutlined />} onClick={addNewColorRule} className="w-full">
                Add Rule
              </Button>
            </Space>
          </Card>
        </Space>
      </Card>

      {/* Legend */}
      <Card title="Legend" size="small">
        <Space direction="vertical" className="w-full">
          <Text strong>Example Rules:</Text>
          <div className="text-sm space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>{"< 10 → Red"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>{"≥ 10 and < 25 → Blue"}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>{"≥ 25 → Green"}</span>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  )
}
