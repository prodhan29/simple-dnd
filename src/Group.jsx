import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import {Card} from './Card';


const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};

export const Group = ({ id, item: groupQuestion, index, moveCard, updateCard }) => {
    const ref = useRef(null);
    const [{ handlerId, isOver }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
                isOver: monitor.isOver({ shallow: true }),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;
            // Don't replace items with themselves

            console.log('in group item.index: ', item, ' index: ', index, 'monitor item: ', monitor.getItem());
            const result = groupQuestion.cards.filter((data) => data.id === item.id);
            console.log('group item', item, isOver ,result);
            if(result.length === 0) {
                groupQuestion.cards.push(item);
                updateCard({index, node: groupQuestion, pastIndex: item.index});
            }

            if (dragIndex === hoverIndex) {
                return;
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            // Get vertical middle
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            // Determine mouse position
            const clientOffset = monitor.getClientOffset();
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return;
            }
            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return;
            }
            // Time to actually perform the action
            // moveCard(dragIndex, hoverIndex);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            // item.index = hoverIndex;
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: () => {
            return { id, index, type: 'card' };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (<div ref={ref} style={{ ...style, opacity }} >
            {groupQuestion.text}
			<ul>
                {groupQuestion.cards.map((value, index)=>
                    <Card key={value.id} index={index} id={value.id} text={value.text} moveCard={moveCard}/>
                )}
            </ul>
		</div>);
};
