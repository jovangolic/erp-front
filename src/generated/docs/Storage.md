# Storage


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**location** | **string** |  | [optional] [default to undefined]
**capacity** | **number** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**usedCapacity** | **number** |  | [optional] [default to undefined]
**hasShelvesFor** | **boolean** |  | [optional] [default to undefined]
**goods** | [**Array&lt;Goods&gt;**](Goods.md) |  | [optional] [default to undefined]
**shelves** | [**Array&lt;Shelf&gt;**](Shelf.md) |  | [optional] [default to undefined]
**outgoingShipments** | [**Array&lt;Shipment&gt;**](Shipment.md) |  | [optional] [default to undefined]
**outgoingTransfers** | [**Array&lt;StockTransfer&gt;**](StockTransfer.md) |  | [optional] [default to undefined]
**incomingTransfers** | [**Array&lt;StockTransfer&gt;**](StockTransfer.md) |  | [optional] [default to undefined]
**materials** | [**Array&lt;Material&gt;**](Material.md) |  | [optional] [default to undefined]
**outgoingMaterialMovements** | [**Array&lt;MaterialMovement&gt;**](MaterialMovement.md) |  | [optional] [default to undefined]
**incomingMaterialMovements** | [**Array&lt;MaterialMovement&gt;**](MaterialMovement.md) |  | [optional] [default to undefined]
**workCenters** | [**Array&lt;WorkCenter&gt;**](WorkCenter.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Storage } from './api';

const instance: Storage = {
    id,
    name,
    location,
    capacity,
    type,
    status,
    usedCapacity,
    hasShelvesFor,
    goods,
    shelves,
    outgoingShipments,
    outgoingTransfers,
    incomingTransfers,
    materials,
    outgoingMaterialMovements,
    incomingMaterialMovements,
    workCenters,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
