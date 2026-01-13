"use client";

import React, { useState } from "react";
import { Drawer, Button, Form, Input, message, Space, Switch, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Emi } from "@/services/emi";
import { updateEmiPlan, deleteEmiPlan } from "@/services/emi";
import { useRouter } from "next/navigation";

interface Props {
  emi: Emi;
}

export const EmiDetailsSheet: React.FC<Props> = ({ emi }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleOpen = () => {
    form.setFieldsValue({
      isActive: emi.isActive,
      plans: emi.plans,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    form.resetFields();
  };

  const onUpdateFinish = async (values: any) => {
    try {
      setLoading(true);

      // Ensure numbers are properly typed
      const payload = {
        plans: (values.plans || []).map((plan: any) => ({
          months: Number(plan.months),
          interestRate: Number(plan.interestRate),
        })),
      };

      await updateEmiPlan(emi._id || "", payload);
      message.success("EMI plan updated successfully!");
      handleClose();
      router.refresh();
    } catch (error: any) {
      console.error("EMI update error:", error);
      message.error(error.message || "Failed to update EMI plan");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await deleteEmiPlan(emi._id || "");
      message.success("EMI plan deleted successfully!");
      router.refresh();
    } catch (error: any) {
      message.error(error.message || "Failed to delete EMI plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Space>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleOpen}
          size="small"
        >
          Edit
        </Button>
        <Popconfirm
          title="Delete EMI Plan"
          description="Are you sure you want to delete this EMI plan?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleDelete}
        >
          <Button danger icon={<DeleteOutlined />} size="small" loading={loading}>
            Delete
          </Button>
        </Popconfirm>
      </Space>

      <Drawer
        title="Edit EMI Plan"
        placement="right"
        onClose={handleClose}
        open={open}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onUpdateFinish}
        >
          <Form.List name="plans">
            {(fields, { add, remove }) => (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">EMI Plans</h3>
                {fields.map(({ key, name, ...restField }, index) => (
                  <div
                    key={key}
                    className="flex gap-3 p-3 border rounded-lg bg-gray-50 items-end"
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "months"]}
                      label="Months"
                      rules={[{ required: true, message: "Required" }]}
                      className="flex-1 mb-0"
                    >
                      <Input type="number" placeholder="3" min={1} max={60} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "interestRate"]}
                      label="Interest Rate (%)"
                      rules={[{ required: true, message: "Required" }]}
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

                    <Button
                      danger
                      onClick={() => remove(name)}
                      disabled={fields.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  className="mt-2"
                >
                  + Add Plan
                </Button>
              </div>
            )}
          </Form.List>

          <Form.Item className="mt-6">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
            >
              Update EMI Plan
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
