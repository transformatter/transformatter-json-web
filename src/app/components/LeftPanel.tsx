import * as React from 'react';
import styled from 'styled-components';
import Button from 'yuai-buttons/dist/Button';
import { ItemsContext, ActionType, Operator, Format } from '@src/app/contexts/ItemsContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { operate } from '@src/app/services/itemsService';

const Container = styled.div`
  width: 50%;
  height: 100%;
  padding: 12px;

  ${({ disabled }: { disabled: boolean }) => disabled && `
    opacity: 0.5;
    pointer-events: none;
  `}
`;
const StyledButton = styled(Button)`
  background: none;
  border: 1px solid ${({ theme }) => theme.borderColor};
  color: inherit;
  margin-right: 10px;
  padding: 5px 11px;

  &:hover {
    background: ${({ theme }) => theme.activeColor};
  }
`;

export default function LeftPanel() {
  const { state, dispatch } = React.useContext(ItemsContext);
  const selectedItem = state.selectedId && state.items[state.selectedId];
  const beautify = async () => {
    if (!selectedItem || !selectedItem.input || !selectedItem.inputFormat) return;

    const payload = {
      outputSpace: selectedItem.outputSpace || 2,
      outputStable: selectedItem.outputStable || false,
      outputFormat: Format.JSON,
      operator: Operator.BEAUTIFY_JSON,
      input:  selectedItem.input,
      inputFormat: selectedItem.inputFormat
    };

    const res = await operate(payload);

    if (res.ok) {
      dispatch({ type: ActionType.PATCH_ITEM, payload: { ...payload, ...res.data } });
    } else {
      dispatch({ type: ActionType.PATCH_ITEM, payload: { errorMessage: res.data.message, output: null } })
    }
  };

  return (
    <Container disabled={selectedItem && selectedItem.input ? false : true}>
      <StyledButton onClick={beautify}><FontAwesomeIcon icon={faPlay} /> Beautify</StyledButton>
    </Container>
  );
}
