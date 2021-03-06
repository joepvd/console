import * as React from 'react';
import { ListPage } from '@console/internal/components/factory';
import { referenceForModel } from '@console/internal/module/k8s';
import { getBadgeFromType } from '@console/shared';
import { ServiceModel } from '../../models';
import ServiceList from './ServiceList';

export interface ServicesPageProps {
  namespace: string;
}

const ServicesPage: React.FC<React.ComponentProps<typeof ListPage>> = (props) => (
  <ListPage
    {...props}
    canCreate
    kind={referenceForModel(ServiceModel)}
    ListComponent={ServiceList}
    badge={getBadgeFromType(ServiceModel.badge)}
  />
);

export default ServicesPage;
