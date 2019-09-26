import * as React from 'react';
import { shallow } from 'enzyme';
import { TransformTopologyData } from '../topology-utils';
import Graph from '../Graph';
import { nodeProvider, edgeProvider, groupProvider } from '../shape-providers';
import { ActionProviders } from '../actions-providers';
import { MockGraphResources } from './graph-test-data';

const mockCheURL = 'https://mock-che.test-cluster.com';

describe('Graph', () => {
  let topologyData;
  let graphWrapper;
  let mockSelectFn;

  beforeEach(() => {
    topologyData = new TransformTopologyData(MockGraphResources, undefined, mockCheURL)
      .transformDataBy('deployments')
      .transformDataBy('deploymentConfigs')
      .transformDataBy('daemonSets')
      .transformDataBy('statefulSets')
      .getTopologyData();
    mockSelectFn = jest.fn();
    const actionProvider = new ActionProviders(topologyData.topology);
    graphWrapper = shallow(
      <Graph
        graph={topologyData.graph}
        topology={topologyData.topology}
        onSelect={mockSelectFn}
        actionProvider={actionProvider.getActions}
        nodeProvider={nodeProvider}
        edgeProvider={edgeProvider}
        groupProvider={groupProvider}
        onUpdateNodeGroup={this.onUpdateNodeGroup}
        onCreateConnection={this.onCreateConnection}
        onRemoveConnection={this.onRemoveConnection}
        graphApiRef={this.graphApiRef}
      />,
    );
    graphWrapper.setState({
      dimensions: {
        width: 500,
        height: 300,
      },
    });
  });

  xit('should display the workload nodes', () => {
    expect(graphWrapper.find('.odc-base-node').length).toBe(7);
  });

  xit('should display the connectors', () => {
    expect(graphWrapper.find('.odc-base-edge').length).toBe(3);
  });

  xit('should display the groups', () => {
    expect(graphWrapper.find('.odc-default-group').length).toBe(3);
  });

  xit('should call onSelect on a node click', () => {
    const node = graphWrapper.find('.odc-base-node').first();
    const nodeEventHandler = node.find('[data-test-id="base-node-handler"]').first();
    nodeEventHandler.simulate('click');
    expect(mockSelectFn).toHaveBeenCalled();
  });

  xit('should display the create connector component on node hover', () => {
    expect(graphWrapper.find('.odc-dragging-create-connector').exists()).toBeFalsy();
    const node = graphWrapper.find('.odc-base-node').first();
    const nodeEventHandler = node.find('[data-test-id="base-node-handler"]').first();
    nodeEventHandler.simulate('mouseenter');
    expect(graphWrapper.find('.odc-dragging-create-connector').exists()).toBeTruthy();
    nodeEventHandler.simulate('mouseleave');
    expect(graphWrapper.find('.odc-dragging-create-connector').exists()).toBeFalsy();
  });

  xit('should highlight a connector on hover', () => {
    expect(graphWrapper.find('.odc-base-edge.is-hover').exists()).toBeFalsy();
    const connectorHandler = graphWrapper.find('[data-test-id="connects-to-handler"]').first();
    connectorHandler.simulate('mouseenter');
    expect(graphWrapper.find('.odc-base-edge.is-hover').exists()).toBeTruthy();
    connectorHandler.simulate('mouseleave');
    expect(connectorHandler.find('.odc-base-edge.is-hover').exists()).toBeFalsy();
  });

  xit('should display the remove icon on a connector on hover', () => {
    const connectorHandler = graphWrapper.find('[data-test-id="connects-to-handler"]').first();
    expect(graphWrapper.find('.odc-base-edge.is-hover').exists()).toBeFalsy();
    connectorHandler.simulate('mouseenter');
    expect(graphWrapper.find('.odc-connects-to__remove-bg').exists()).toBeTruthy();
    connectorHandler.simulate('mouseleave');
    expect(graphWrapper.find('.odc-base-edge.is-hover').exists()).toBeFalsy();
  });
});
