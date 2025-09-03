# ShipmentForEventLogResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**shipmentDate** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**logisticsProviderResponse** | [**LogisticsProviderResponse**](LogisticsProviderResponse.md) |  | [optional] [default to undefined]
**outboundDeliveryResponse** | [**OutboundDeliveryResponse**](OutboundDeliveryResponse.md) |  | [optional] [default to undefined]
**trackingInfoBasicResponse** | [**TrackingInfoBasicResponse**](TrackingInfoBasicResponse.md) |  | [optional] [default to undefined]
**storageBasicResponse** | [**StorageBasicResponse**](StorageBasicResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ShipmentForEventLogResponse } from './api';

const instance: ShipmentForEventLogResponse = {
    id,
    shipmentDate,
    status,
    logisticsProviderResponse,
    outboundDeliveryResponse,
    trackingInfoBasicResponse,
    storageBasicResponse,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
