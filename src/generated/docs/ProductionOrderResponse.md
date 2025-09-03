# ProductionOrderResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**orderNumber** | **string** |  | [optional] [default to undefined]
**productResponse** | [**ProductResponse**](ProductResponse.md) |  | [optional] [default to undefined]
**quantityPlanned** | **number** |  | [optional] [default to undefined]
**quantityProduced** | **number** |  | [optional] [default to undefined]
**startDate** | **string** |  | [optional] [default to undefined]
**endDate** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**workCenterResponse** | [**WorkCenterResponse**](WorkCenterResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { ProductionOrderResponse } from './api';

const instance: ProductionOrderResponse = {
    id,
    orderNumber,
    productResponse,
    quantityPlanned,
    quantityProduced,
    startDate,
    endDate,
    status,
    workCenterResponse,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
