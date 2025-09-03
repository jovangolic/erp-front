# InspectionForDefectResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**code** | **string** |  | [optional] [default to undefined]
**type** | **string** |  | [optional] [default to undefined]
**inspectionDate** | **string** |  | [optional] [default to undefined]
**basicBatchResponse** | [**BasicBatchResponse**](BasicBatchResponse.md) |  | [optional] [default to undefined]
**productResponse** | [**ProductResponse**](ProductResponse.md) |  | [optional] [default to undefined]
**userResponse** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]
**quantityInspected** | **number** |  | [optional] [default to undefined]
**quantityAccepted** | **number** |  | [optional] [default to undefined]
**quantityRejected** | **number** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**result** | **string** |  | [optional] [default to undefined]
**inspectionForQualityCheckResponse** | [**InspectionForQualityCheckResponse**](InspectionForQualityCheckResponse.md) |  | [optional] [default to undefined]
**inspectionForTestMeasurementResponses** | [**Array&lt;InspectionForTestMeasurementResponse&gt;**](InspectionForTestMeasurementResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { InspectionForDefectResponse } from './api';

const instance: InspectionForDefectResponse = {
    id,
    code,
    type,
    inspectionDate,
    basicBatchResponse,
    productResponse,
    userResponse,
    quantityInspected,
    quantityAccepted,
    quantityRejected,
    notes,
    result,
    inspectionForQualityCheckResponse,
    inspectionForTestMeasurementResponses,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
