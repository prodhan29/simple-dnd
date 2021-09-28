import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
const style = {
    border: '1px dashed gray',
    padding: '0.5rem 1rem',
    marginBottom: '.5rem',
    backgroundColor: 'white',
    cursor: 'move',
};
export const Card = ({ item: card, moveCard, path }) => {
    const ref = useRef(null);
    const [{ handlerId }, drop] = useDrop({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item, monitor) {
            if (!ref.current) {
                console.log(item.type);
                return;
            }
        
            // Time to actually perform the action
            moveCard(item.path, path);
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
           
        },
    });
    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: () => {
            return { ...card, path };
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });
    const opacity = isDragging ? 0.4 : 1;
    drag(drop(ref));
    
    return  card.type === 'card' ? (
                <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
                    {card.text}
                </div>
            ):(
                <div ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}>
                    {card.text}
                    <ul>
                        {card.cards.map((value, index)=>
                            <Card key={value.id} item={value} moveCard={moveCard} path={`${path},${index}`} />
                        )}
                    </ul>
                </div>
            )
    };
