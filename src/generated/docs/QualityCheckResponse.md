# QualityCheckResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**locDate** | **string** |  | [optional] [default to undefined]
**userResponse** | [**UserResponse**](UserResponse.md) |  | [optional] [default to undefined]
**referenceType** | **string** |  | [optional] [default to undefined]
**referenceId** | **number** |  | [optional] [default to undefined]
**checkType** | **string** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**notes** | **string** |  | [optional] [default to undefined]
**inspectionResponses** | [**Array&lt;InspectionResponse&gt;**](InspectionResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { QualityCheckResponse } from './api';

const instance: QualityCheckResponse = {
    id,
    locDate,
    userResponse,
    referenceType,
    referenceId,
    checkType,
    status,
    notes,
    inspectionResponses,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
