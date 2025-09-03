# ShipmentRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**shipmentDate** | **string** |  | [default to undefined]
**status** | **string** |  | [default to undefined]
**providerId** | **number** |  | [default to undefined]
**outboundDeliveryId** | **number** |  | [default to undefined]
**trackingInfo** | [**TrackingInfoRequest**](TrackingInfoRequest.md) |  | [default to undefined]
**originStorageId** | **number** |  | [default to undefined]
**eventLogRequest** | [**Array&lt;EventLogRequest&gt;**](EventLogRequest.md) |  | [default to undefined]

## Example

```typescript
import { ShipmentRequest } from './api';

const instance: ShipmentRequest = {
    id,
    shipmentDate,
    status,
    providerId,
    outboundDeliveryId,
    trackingInfo,
    originStorageId,
    eventLogRequest,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
