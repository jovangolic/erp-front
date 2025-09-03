# Product


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**barCodes** | [**Array&lt;BarCode&gt;**](BarCode.md) |  | [optional] [default to undefined]
**unitMeasure** | **string** |  | [optional] [default to undefined]
**supplierType** | **string** |  | [optional] [default to undefined]
**storageType** | **string** |  | [optional] [default to undefined]
**goodsType** | **string** |  | [optional] [default to undefined]
**storage** | [**Storage**](Storage.md) |  | [optional] [default to undefined]
**supply** | [**Supply**](Supply.md) |  | [optional] [default to undefined]
**shelf** | [**Shelf**](Shelf.md) |  | [optional] [default to undefined]
**currentQuantity** | **number** |  | [optional] [default to undefined]
**composition** | [**Array&lt;RawMaterial&gt;**](RawMaterial.md) |  | [optional] [default to undefined]
**inventoryItems** | [**Array&lt;InventoryItems&gt;**](InventoryItems.md) |  | [optional] [default to undefined]
**qualityStandards** | [**Array&lt;QualityStandard&gt;**](QualityStandard.md) |  | [optional] [default to undefined]

## Example

```typescript
import { Product } from './api';

const instance: Product = {
    id,
    name,
    barCodes,
    unitMeasure,
    supplierType,
    storageType,
    goodsType,
    storage,
    supply,
    shelf,
    currentQuantity,
    composition,
    inventoryItems,
    qualityStandards,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
