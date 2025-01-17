package org.opendatadiscovery.oddplatform.repository;

import java.util.List;
import java.util.Set;
import org.jeasy.random.EasyRandom;
import org.jeasy.random.EasyRandomParameters;
import org.jooq.JSONB;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.opendatadiscovery.oddplatform.BaseIntegrationTest;
import org.opendatadiscovery.oddplatform.api.contract.model.DataSetFieldStat;
import org.opendatadiscovery.oddplatform.api.contract.model.DataSetFieldType;
import org.opendatadiscovery.oddplatform.dto.DatasetFieldWithLabelsDto;
import org.opendatadiscovery.oddplatform.model.tables.pojos.DatasetFieldPojo;
import org.opendatadiscovery.oddplatform.model.tables.pojos.LabelPojo;
import org.opendatadiscovery.oddplatform.repository.reactive.ReactiveDatasetFieldRepository;
import org.opendatadiscovery.oddplatform.utils.JSONTestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import reactor.test.StepVerifier;

import static org.assertj.core.api.Assertions.assertThat;
import static org.jeasy.random.FieldPredicates.ofType;
import static org.jooq.JSONB.jsonb;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ReactiveDatasetFieldRepositoryImplTest extends BaseIntegrationTest {

    @Autowired
    private ReactiveDatasetFieldRepository reactiveDatasetFieldRepository;
    private static final EasyRandom EASY_RANDOM;

    static {
        final EasyRandomParameters easyRandomParameters = new EasyRandomParameters();
        easyRandomParameters.excludeField(ofType(JSONB.class));
        EASY_RANDOM = new EasyRandom(easyRandomParameters);
    }

    @Test
    @DisplayName("Test get dataset field with labels from database")
    void testGetDatasetFieldWithLabels() {
        final DatasetFieldWithLabelsDto datasetFieldDto = createDatasetFieldWithLabelsDto();
        final List<DatasetFieldPojo> datasetFieldPojos = List.of(datasetFieldDto.datasetFieldPojo());
        reactiveDatasetFieldRepository.bulkCreate(datasetFieldPojos).collectList().block();
        final DatasetFieldPojo expectedDatasetFieldPojo = datasetFieldPojos.get(0);

        reactiveDatasetFieldRepository.getDatasetFieldWithLabels(expectedDatasetFieldPojo.getId())
            .as(StepVerifier::create)
            .assertNext(dto -> {
                assertNotNull(dto);
                final DatasetFieldPojo actualDataSetFieldPojo = dto.datasetFieldPojo();
                assertThat(actualDataSetFieldPojo).isNotNull();
                assertDataField(expectedDatasetFieldPojo, actualDataSetFieldPojo);
            })
            .verifyComplete();
    }

    @Test
    @DisplayName("Test update description")
    void testUpdateDescription() {
        final DatasetFieldPojo pojo = EASY_RANDOM.nextObject(DatasetFieldPojo.class);
        final List<DatasetFieldPojo> datasetFieldPojos = List.of(pojo);
        reactiveDatasetFieldRepository.bulkCreate(datasetFieldPojos).collectList().block();
        final DatasetFieldPojo expectedDatasetFieldPojo = datasetFieldPojos.get(0);

        final String newDescription = "new Description";
        reactiveDatasetFieldRepository.updateDescription(expectedDatasetFieldPojo.getId(), newDescription)
            .as(StepVerifier::create)
            .assertNext(datasetFieldPojo -> {
                assertNotNull(datasetFieldPojo);
                assertEquals(newDescription, datasetFieldPojo.getInternalDescription());
                assertEquals(expectedDatasetFieldPojo.getExternalDescription(),
                    datasetFieldPojo.getExternalDescription());
            })
            .verifyComplete();
    }

    private void assertDataField(final DatasetFieldPojo expectedDatasetFieldPojo,
                                 final DatasetFieldPojo actualDataSetField) {
        assertEquals(expectedDatasetFieldPojo.getId(), actualDataSetField.getId());
        assertEquals(expectedDatasetFieldPojo.getName(), actualDataSetField.getName());
        assertEquals(expectedDatasetFieldPojo.getOddrn(), actualDataSetField.getOddrn());
        assertEquals(expectedDatasetFieldPojo.getIsKey(), actualDataSetField.getIsKey());
        assertEquals(expectedDatasetFieldPojo.getIsValue(), actualDataSetField.getIsValue());
        assertEquals(expectedDatasetFieldPojo.getExternalDescription(), actualDataSetField.getExternalDescription());
        assertEquals(expectedDatasetFieldPojo.getInternalDescription(), actualDataSetField.getInternalDescription());
    }

    private DatasetFieldWithLabelsDto createDatasetFieldWithLabelsDto() {
        final DatasetFieldPojo datasetFieldPojo = EASY_RANDOM.nextObject(DatasetFieldPojo.class);
        final DataSetFieldStat dataSetFieldStat = EASY_RANDOM.nextObject(DataSetFieldStat.class);
        final DataSetFieldType dataSetFieldType = EASY_RANDOM.nextObject(DataSetFieldType.class);
        datasetFieldPojo.setType(jsonb(JSONTestUtils.createJson(dataSetFieldType)));
        datasetFieldPojo.setStats(jsonb(JSONTestUtils.createJson(dataSetFieldStat)));

        final LabelPojo labelPojo = EASY_RANDOM.nextObject(LabelPojo.class);
        return new DatasetFieldWithLabelsDto(datasetFieldPojo, Set.of(labelPojo));
    }
}