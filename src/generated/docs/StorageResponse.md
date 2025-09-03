# StorageResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**location** | **string** |  | [optional] [default to undefined]
**capacity** | **number** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**goods** | [**Array&lt;GoodsResponse&gt;**](GoodsResponse.md) |  | [optional] [default to undefined]
**shelves** | [**Array&lt;ShelfResponse&gt;**](ShelfResponse.md) |  | [optional] [default to undefined]
**outgoingShipments** | [**Array&lt;ShipmentResponse&gt;**](ShipmentResponse.md) |  | [optional] [default to undefined]
**outgoingTransfers** | [**Array&lt;StockTransferResponse&gt;**](StockTransferResponse.md) |  | [optional] [default to undefined]
**incomingTransfers** | [**Array&lt;StockTransferResponse&gt;**](StockTransferResponse.md) |  | [optional] [default to undefined]
**materialResponses** | [**Array&lt;MaterialResponse&gt;**](MaterialResponse.md) |  | [optional] [default to undefined]
**workCenterResponses** | [**Array&lt;WorkCenterResponse&gt;**](WorkCenterResponse.md) |  | [optional] [default to undefined]
**outgoingMaterialMovements** | [**Array&lt;MaterialMovementResponse&gt;**](MaterialMovementResponse.md) |  | [optional] [default to undefined]
**incomingMaterialMovements** | [**Array&lt;MaterialMovementResponse&gt;**](MaterialMovementResponse.md) |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]

## Example

```typescript
import { StorageResponse } from './api';

const instance: StorageResponse = {
    id,
    name,
    location,
    capacity,
    type,
    goods,
    shelves,
    outgoingShipments,
    outgoingTransfers,
    incomingTransfers,
    materialResponses,
    workCenterResponses,
    outgoingMaterialMovements,
    incomingMaterialMovements,
    status,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
