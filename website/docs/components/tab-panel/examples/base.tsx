import React, { useState } from 'react';
import TabPanel from '@semcore/ui/tab-panel';
import Badge from '@semcore/ui/badge';
import Tooltip from '@semcore/ui/tooltip';
import LinkedInM from '@semcore/ui/icon/LinkedIn/m';

const Demo = () => {
  const [value, setValue] = useState(0);
  return (
    <TabPanel onChange={setValue} value={value} aria-label='Page'>
      <TabPanel.Item value={0}>Overview</TabPanel.Item>
      <TabPanel.Item value={1}>Issues</TabPanel.Item>
      <TabPanel.Item value={2}>
        <TabPanel.Item.Addon>
          <LinkedInM />
        </TabPanel.Item.Addon>
        <TabPanel.Item.Text>LinkedIn</TabPanel.Item.Text>
        <TabPanel.Item.Addon>
          <Badge bg='green'>new</Badge>
        </TabPanel.Item.Addon>
      </TabPanel.Item>
      <Tooltip title='Progress isn’t available during collecting process' placement='top'>
        <TabPanel.Item disabled value={3}>
          Progress
        </TabPanel.Item>
      </Tooltip>
      <TabPanel.Item value={4}>Statistics</TabPanel.Item>
    </TabPanel>
  );
};

export default Demo;
