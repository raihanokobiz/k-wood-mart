"use client";

import React, { useState } from "react";
import { Form, Input, Button, Card, Space, message, Switch } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { createEmiPlan } from "@/services/emi";
import { useRouter } from "next/navigation";

type FieldType = {
  isActive?: boolean;
  plans?: Array<{
    months?: number;
    interestRate?: number;
  }>;
};

export const CreateEmiForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: FieldType) => {
    try {
      setLoading(true);

      // Ensure numbers are properly typed
      const payload = {
        plans: (values.plans || []).map(plan => ({
          months: Number(plan.months),
          interestRate: Number(plan.interestRate),
        })),
      };

      console.log(payload, "Submitting EMI data");

      await createEmiPlan(payload);
      message.success("EMI plans created successfully!");
      form.resetFields();
      router.refresh();
    } catch (error: any) {
      console.error("EMI creation error:", error);
      message.error(error.message || "Failed to create EMI plans");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2">
      <Card className="m-6 rounded-lg" title="Create EMI Plans">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            plans: [{ months: 3, interestRate: 0 }],
          }}
        >
          {/* EMI Plans Array */}
          <Form.List name="plans">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">EMI Plans</h3>
                  <Button
                    className="bg-primary"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => add()}
                    size="middle"
                  >
                    Add Plan
                  </Button>
                </div>

                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex gap-3 p-4 border rounded-lg bg-gray-50 items-end"
                  >
                    {/* Months Input */}
                    <Form.Item
                      {...restField}
                      name={[name, "months"]}
                      label="Months"
                      className="flex-1 mb-0"
                    >
                      <Input
                        type="number"
                        placeholder="3"
                        min={1}
                        max={60}
                      />
                    </Form.Item>

                    {/* Interest Rate Input */}
                    <Form.Item
                      {...restField}
                      name={[name, "interestRate"]}
                      label="Interest Rate (%)"
                      className="flex-1 mb-0"
                    >
                      <Input
                        type="number"
                        placeholder="0"
                        min={0}
                        max={100}
                        step={0.1}
                      />
                    </Form.Item>

                    {/* Remove Button */}
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                      disabled={fields.length === 1}
                      size="middle"
                    />
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center p-4 border border-dashed rounded-lg">
                    <p className="text-gray-500 mb-2">No EMI plans added yet</p>
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      onClick={() => add()}
                      block
                    >
                      Add First Plan
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Form.List>

          {/* Submit Button */}
          <Form.Item className="mt-6">
            <Button
              className="bg-primary"
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              block
            >
              {loading ? "Creating..." : "Create EMI Plans"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
