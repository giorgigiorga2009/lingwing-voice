import { FC } from 'react';
import { Dialog } from './Dialog';
import { Grammar } from './Grammar';
import style from './ChatHistory.module.scss';
import { TaskData } from '@utils/lessons/getTask';
import { TranslateBubble } from './chatBubbles/TranslateBubble';
import { getLevelColors } from '@utils/lessons/taskInputUtils';

interface HistoryProps {
  completedTasks: TaskData[];
  courseObj?: any;
  fetchType?: 'default' | 'ordinalNumber' | 'taskType';
}

const ChatHistory: FC<HistoryProps> = ({
  completedTasks,
  courseObj,
  fetchType,
}) => {
  const filterAnswers = (answers: any[], learnMode: number) => {
    if (!Array.isArray(answers)) return answers;
    return answers.slice(0, learnMode);
  };


  return (
    <div className={style.chatHistoryContainer}>
      {completedTasks.map((task, index) => {
        let dialogArrayTo = [];
        let dialogArrayFrom = [];
        let dialogArrayAudio = [];
        // let isHistory = false;

        if (task.taskType === 'dialog') {
          // const original = task?.obj?.wordsAudio?.dialog?.original[0]?.original;
          const original =
            fetchType === 'taskType'
              ? task?.obj?.wordsAudio?.dialog?.original[0].original
              : task?.obj?.wordsAudio?.dialog?.original;

          const translation = task?.obj?.wordsAudio?.dialog?.translation;

          // if (task === translation.length - 1) {
          //   isHistory = true;
          // } else {
          //   isHistory = false;
          // }

          dialogArrayTo = original.map((item: any) => item.sentence[0] || '');
          dialogArrayFrom = translation.map(
            (item: any) => item.sentence?.text || ''
          );
          dialogArrayAudio = translation.map((item: any) =>
            item.sentence?.filePath && item.sentence?.audioFileName
              ? item.sentence?.filePath + '/' + item.sentence?.audioFileName
              : null
          );
        }

        const taskType = task.taskType;
        const filteredAnswers = filterAnswers(
          task.answers,
          courseObj.learnMode
        );



        
        return (
          <div key={index} className={style.chatHistory}>
            {task.taskType === 'welcome' && (
              <TranslateBubble
                utteranceType="taskDescription"
                textType={task.taskType}
                isCurrentTask={false}
                taskText={task.taskText}
                correctText={task.correctText as string}
                mistakesByLevel={[]}
                // isWelcome = {false}
                isWelcome={completedTasks.filter((item:any) => item.taskType === 'welcome').length  - 1 !== index}
              />
            )}

            {taskType === 'dictation' && (
              <>
                <TranslateBubble
                  utteranceType="taskDescription"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.taskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={filteredAnswers}
                />
                <TranslateBubble
                  utteranceType="answer"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.taskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={filteredAnswers}
                />
              </>
            )}
            {(taskType === 'translate' || taskType === 'omittedwords') && (
              <>
                <TranslateBubble
                  utteranceType="taskDescription"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.taskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={filteredAnswers}
                />
                <TranslateBubble
                  utteranceType="answer"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.taskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={getLevelColors({
                    currentTask: task,
                    currentCourseObject: courseObj,
                  })}
                />
              </>
            )}

            {taskType === 'mistakecorrection' && (
              <>
                <TranslateBubble
                  utteranceType="taskDescription"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.mistakeTaskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={filteredAnswers}
                />
                <TranslateBubble
                  utteranceType="answer"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.mistakeTaskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={filteredAnswers}
                />
              </>
            )}

            {taskType === 'replay' && (
              <>
                <TranslateBubble
                  utteranceType="taskDescription"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.taskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={filteredAnswers}
                />
                <TranslateBubble
                  utteranceType="answer"
                  textType={taskType}
                  isCurrentTask={false}
                  taskText={task.taskText}
                  correctText={task.correctText as string}
                  mistakesByLevel={filteredAnswers}
                />
              </>
            )}
            {taskType === 'dialog' && (
              <Dialog
                // dialogArrayTo={task.correctText as string[]}
                // dialogArrayFrom={task.taskText as string}
                isHistory={true}
                mistakesByLevel={filteredAnswers}
                dialogArrayTo={dialogArrayTo as string[]}
                dialogArrayFrom={dialogArrayFrom as string[]}
                dialogArrayAudio={dialogArrayAudio as string[]}
              />
            )}
            {taskType === 'grammar' && (
              <Grammar
                taskText={task.taskText}
                mistakesByLevel={filteredAnswers}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ChatHistory;
