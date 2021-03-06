import React, { useContext } from 'react';
import styles from '../TestCase/TestCase.module.scss';
import { ReduxTestCaseContext } from '../../context/reducers/reduxTestCaseReducer';
import { updateReduxTestStatement, updateStatementsOrder } from '../../context/actions/reduxTestCaseActions';
import ReduxTestMenu from '../TestMenu/ReduxTestMenu';
import ReduxTestStatements from './ReduxTestStatements';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { ReduxStatements, ReduxTestCaseState } from '../../utils/reduxTypes'

const ReduxTestCase = () => {
  const [{ reduxTestStatement, reduxStatements }, dispatchToReduxTestCase] = useContext(
    ReduxTestCaseContext
  );

  const handleUpdateReduxTestStatement = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchToReduxTestCase(updateReduxTestStatement(e.target.value));
  };

  const reorder = (list: ReduxStatements[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }
    const reorderedStatements: Array<ReduxStatements> = reorder(
      reduxStatements,
      result.source.index,
      result.destination.index
    );
    dispatchToReduxTestCase(updateStatementsOrder(reorderedStatements));
  };

  return (
    <div>
      <div id='head'>
        <ReduxTestMenu dispatchToReduxTestCase={dispatchToReduxTestCase} />
      </div>

      <div id={styles.testMockSection}>
        <section id={styles.testCaseHeader}>
          <label htmlFor='test-statement'>Test</label>
          <input
            type='text'
            id={styles.testStatement}
            value={reduxTestStatement}
            onChange={handleUpdateReduxTestStatement}
          />
        </section>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='droppable'>
          {provided => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <ReduxTestStatements
                reduxStatements={reduxStatements}
                dispatchToReduxTestCase={dispatchToReduxTestCase}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ReduxTestCase;
