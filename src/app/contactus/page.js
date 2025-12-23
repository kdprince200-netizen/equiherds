"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Send } from "lucide-react";
import { Form, Input, Select, DatePicker, TimePicker, Button, Row, Col, Card } from "antd";
import dayjs from "dayjs";
import TopSection from "../components/topSection";

export default function ContactPage() {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: values.name,
          userEmail: values.email, 
          phNumber: values.phone,
          purpose: values.subject,
          date: values.date ? values.date.format('YYYY-MM-DD') : '',
          callDuration: values.callDuration,
          time: values.time ? values.time.format('h:mm A') : '',
          question: values.question,
          hostEmail: "Info@equiherds.com"
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully! We'll get back to you soon.");
        form.resetFields();
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans">
      <TopSection title="Contact us" bgImage="/product/4.jpg" />
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-4xl px-4">
          <div className="mb-8 text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-3">Send us a Message</h3>
            <p className="text-gray-600">
              Have a question about our services? Need help with booking? We&apos;re here to help.
            </p>
          </div>

          <Card className="shadow-lg">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="max-w-none"
            >
              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Full Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter your full name!' }]}
                  >
                    <Input placeholder="Your full name" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    rules={[
                      { required: true, message: 'Please enter your email!' },
                      { type: 'email', message: 'Please enter a valid email!' }
                    ]}
                  >
                    <Input placeholder="your.email@example.com" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                  >
                    <Input placeholder="+1 (555) 123-4567" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Subject"
                    name="subject"
                    rules={[{ required: true, message: 'Please select a subject!' }]}
                  >
                    <Select placeholder="Select a subject" size="large">
                      <Select.Option value="general">General Inquiry</Select.Option>
                      <Select.Option value="booking">Booking Support</Select.Option>
                      <Select.Option value="stable">Stable Services</Select.Option>
                      <Select.Option value="training">Training Services</Select.Option>
                      <Select.Option value="technical">Technical Support</Select.Option>
                      <Select.Option value="partnership">Partnership</Select.Option>
                      <Select.Option value="other">Other</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Message"
                name="message"
                rules={[{ required: true, message: 'Please enter your message!' }]}
              >
                <Input.TextArea 
                  rows={6} 
                  placeholder="Tell us how we can help you..."
                  size="large"
                />
              </Form.Item>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Preferred Date"
                    name="date"
                  >
                    <DatePicker 
                      placeholder="Select date" 
                      size="large" 
                      className="w-full"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Preferred Time"
                    name="time"
                  >
                    <TimePicker 
                      placeholder="Select time" 
                      size="large" 
                      className="w-full"
                      format="h:mm A"
                      use12Hours
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 16]}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Call Duration"
                    name="callDuration"
                  >
                    <Select placeholder="Select duration" size="large">
                      <Select.Option value="15 minutes">15 minutes</Select.Option>
                      <Select.Option value="30 minutes">30 minutes</Select.Option>
                      <Select.Option value="45 minutes">45 minutes</Select.Option>
                      <Select.Option value="1 hour">1 hour</Select.Option>
                      <Select.Option value="1.5 hours">1.5 hours</Select.Option>
                      <Select.Option value="2 hours">2 hours</Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Specific Question"
                    name="question"
                  >
                    <Input placeholder="What would you like to discuss?" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                  size="large"
                  className="w-full bg-brand hover:bg-brand/90 border-brand"
                  icon={<Send />}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </section>
    </div>
  );
}


