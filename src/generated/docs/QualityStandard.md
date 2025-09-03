# QualityStandard


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**product** | [**Product**](Product.md) |  | [optional] [default to undefined]
**description** | **string** |  | [optional] [default to undefined]
**minValue** | **number** |  | [optional] [default to undefined]
**maxValue** | **number** |  | [optional] [default to undefined]
**unit** | **string** |  | [optional] [default to undefined]
**measurements** | [**Array&lt;TestMeasurement&gt;**](TestMeasurement.md) |  | [optional] [default to undefined]

## Example

```typescript
import { QualityStandard } from './api';

const instance: QualityStandard = {
    id,
    product,
    description,
    minValue,
    maxValue,
    unit,
    measurements,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
