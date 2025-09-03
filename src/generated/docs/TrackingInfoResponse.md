# TrackingInfoResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**trackingNumber** | **string** |  | [optional] [default to undefined]
**currentLocation** | **string** |  | [optional] [default to undefined]
**estimatedDelivery** | **string** |  | [optional] [default to undefined]
**currentStatus** | **string** |  | [optional] [default to undefined]
**shipment** | [**ShipmentResponse**](ShipmentResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { TrackingInfoResponse } from './api';

const instance: TrackingInfoResponse = {
    id,
    trackingNumber,
    currentLocation,
    estimatedDelivery,
    currentStatus,
    shipment,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
