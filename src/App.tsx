import React from 'react';
import { Layout, Typography } from 'antd';
import Board from './components/Board';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', background: '#fff', padding: '0 24px' }}>
        <Title level={3} style={{ margin: 0 }}>To Do List</Title>
      </Header>
      <Content style={{ padding: '24px', height: 'calc(100vh - 64px)' }}>
        <Board />
      </Content>
    </Layout>
  );
};

export default App;
