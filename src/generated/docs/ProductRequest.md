# ProductRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**name** | **string** |  | [optional] [default to undefined]
**unitMeasure** | **string** |  | [optional] [default to undefined]
**supplierType** | **string** |  | [default to undefined]
**storageType** | **string** |  | [default to undefined]
**goodsType** | **string** |  | [default to undefined]
**storageId** | **number** |  | [default to undefined]
**supplyId** | **number** |  | [default to undefined]
**shelfId** | **number** |  | [default to undefined]
**currentQuantity** | **number** |  | [default to undefined]
**barCodes** | [**Array&lt;BarCodeRequest&gt;**](BarCodeRequest.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ProductRequest } from './api';

const instance: ProductRequest = {
    id,
    name,
    unitMeasure,
    supplierType,
    storageType,
    goodsType,
    storageId,
    supplyId,
    shelfId,
    currentQuantity,
    barCodes,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
