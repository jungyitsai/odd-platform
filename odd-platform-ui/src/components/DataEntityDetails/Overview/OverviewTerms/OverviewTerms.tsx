import React from 'react';
import { Box, Collapse, Grid, Typography } from '@mui/material';
import type { LinkedTerm } from 'generated-sources';
import { Permission } from 'generated-sources';
import { Button } from 'components/shared/elements';
import { AddIcon } from 'components/shared/icons';
import { WithPermissions } from 'components/shared/contexts';
import { TermsCaptionContainer } from './OverviewTermsStyles';
import AssignEntityTermForm from './AssignEntityTermForm/AssignEntityTermForm';
import TermItem from './TermItem/TermItem';

interface OverviewTermsProps {
  dataEntityId: number;
  terms?: LinkedTerm[];
}

const OverviewTerms: React.FC<OverviewTermsProps> = ({ terms, dataEntityId }) => {
  const visibleLimit = 20;
  const [viewAll, setViewAll] = React.useState(false);

  return (
    <div>
      <TermsCaptionContainer>
        <Typography variant='h4'>Dictionary terms</Typography>
        <WithPermissions permissionTo={Permission.DATA_ENTITY_ADD_TERM}>
          <AssignEntityTermForm
            dataEntityId={dataEntityId}
            openBtnEl={
              <Button text='Add terms' buttonType='secondary-m' startIcon={<AddIcon />} />
            }
          />
        </WithPermissions>
      </TermsCaptionContainer>
      {terms?.length ? (
        <Box sx={{ mx: -0.5, my: 0 }}>
          {terms
            .slice(0, visibleLimit)
            .sort()
            .map(linkedTerm => (
              <TermItem
                key={linkedTerm.term.id}
                linkedTerm={linkedTerm}
                dataEntityId={dataEntityId}
              />
            ))}
          {terms?.length > visibleLimit && (
            <>
              <Collapse in={viewAll} timeout='auto' unmountOnExit>
                {viewAll &&
                  terms
                    ?.slice(visibleLimit)
                    .sort()
                    .map(linkedTerm => (
                      <TermItem
                        key={linkedTerm.term.id}
                        linkedTerm={linkedTerm}
                        dataEntityId={dataEntityId}
                      />
                    ))}
              </Collapse>
              <Button
                text={viewAll ? 'Hide' : `View All (${terms?.length})`}
                buttonType='tertiary-m'
                sx={{ ml: 0.5, mt: 1.25 }}
                onClick={() => setViewAll(!viewAll)}
              />
            </>
          )}
        </Box>
      ) : (
        <Grid
          item
          xs={12}
          container
          alignItems='center'
          justifyContent='flex-start'
          wrap='nowrap'
        >
          <Typography variant='subtitle2'>Not created.</Typography>
          <WithPermissions permissionTo={Permission.DATA_ENTITY_ADD_TERM}>
            <AssignEntityTermForm
              dataEntityId={dataEntityId}
              openBtnEl={<Button text='Add terms' buttonType='tertiary-sm' />}
            />
          </WithPermissions>
        </Grid>
      )}
    </div>
  );
};

export default OverviewTerms;
