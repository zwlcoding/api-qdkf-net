import React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components';

interface WaitlistEmailProps {
  name: string;
}

export const WaitlistEmail = ({ name }: WaitlistEmailProps) => (
  <Html>
    <Head />
    <Preview>感谢您加入我们的等候名单并感谢您的耐心等待</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>即将推出。</Heading>
        <Text style={text}>
          {name}，感谢您加入我们的等候名单并耐心等待。当我们有新消息时，
          我们会发送通知给您。
        </Text>
      </Container>
    </Body>
  </Html>
);

export default WaitlistEmail;

const main = {
  backgroundColor: '#000000',
  margin: '0 auto',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: 'auto',
  padding: '96px 20px 64px',
};

const h1 = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '40px',
  margin: '0 0 20px',
};

const text = {
  color: '#aaaaaa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 40px',
};
