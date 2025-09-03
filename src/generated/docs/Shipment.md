# Shipment


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**shipmentDate** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**provider** | [**LogisticsProvider**](LogisticsProvider.md) |  | [optional] [default to undefined]
**outboundDelivery** | [**OutboundDelivery**](OutboundDelivery.md) |  | [optional] [default to undefined]
**trackingInfo** | [**TrackingInfo**](TrackingInfo.md) |  | [optional] [default to undefined]
**originStorage** | [**Storage**](Storage.md) |  | [optional] [default to undefined]
**eventLogs** | [**Array&lt;EventLog&gt;**](EventLog.md) |  | [optional] [default to undefined]
**createdAt** | **string** |  | [optional] [default to undefined]
**modifiedAt** | **string** |  | [optional] [default to undefined]
**createdBy** | **string** |  | [optional] [default to undefined]
**modifiedBy** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { Shipment } from './api';

const instance: Shipment = {
    id,
    shipmentDate,
    status,
    provider,
    outboundDelivery,
    trackingInfo,
    originStorage,
    eventLogs,
    createdAt,
    modifiedAt,
    createdBy,
    modifiedBy,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
