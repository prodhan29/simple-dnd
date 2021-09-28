import { useState, useCallback } from 'react';
import { Card } from './Card';
import update from 'immutability-helper';
import { Group } from './Group';
const style = {
    width: 400,
};

const deepClone = (ob) => {
    return JSON.parse(JSON.stringify(ob));
}
const Container = () => {

    const [cards, setCards] = useState([
        {
            id: 1,
            text: 'Write a cool JS library',
            type: 'card',
        },
        {
            id: 2,
            text: 'Make it generic enough',
            type: 'group',
            cards: [{
                id: 8,
                text: 'Samsung',
                type: 'card',
            },
            {
                id: 9,
                text: 'Google',
                type: 'card',
            },
            {
                id: 10,
                text: 'Netflix',
                type: 'card',
            },
            {
                id: 11,
                text: 'LG',
                type: 'card',
            }]
        },
        {
            id: 3,
            text: 'Write README',
            type: 'card',
        },
        {
            id: 4,
            text: 'Create some examples',
            type: 'card',
        },
        {
            id: 5,
            text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
            type: 'card',
        },
        // {
        //     id: 10009,
        //     text: 'wanna join the giant tech ',
        //     type: 'group',
        //     cards: [{   id: 12,
        //         text: 'Samsung',
        //         type: 'card',
        //     },
        //     {
        //         id: 13,
        //         text: 'Google',
        //         type: 'card',
        //     },
        //     {
        //         id: 14,
        //         text: 'Netflix',
        //         type: 'card',
        //     },
        //     {
        //         id: 15,
        //         text: 'LG',
        //         type: 'card',
        //     }]
        // },
        {
            id: 6,
            text: '???',
            type: 'card',
        },
        {
            id: 7,
            text: 'PROFIT',
            type: 'card',
        },
    ]);
    const moveCard = useCallback((dragPath, hoverPath) => {

        const travelToNode = (questionList, path) => {
            const indexes = path.split(',');
            for (let i = 0; i < indexes.length - 1; i++)
                questionList = questionList[parseInt(indexes[i])].cards;
            return questionList;
        }

        const getNodeIndex = (data) => parseInt(data.split(',').pop());

        // const cardS = [...cards];
        // const card  = cardS.splice(dragIndex, 1);
        // cardS.splice(hoverIndex, 0, card[0]);
        // console.log(cardS);
        // setCards(cardS);

        // console.log(dragPath, hoverPath);
        const copyCards = JSON.parse(JSON.stringify(cards));
        const dragParent = travelToNode(copyCards, dragPath);
        const dragNodeIndex = getNodeIndex(dragPath);

        const node = dragParent.splice(dragNodeIndex, 1);

        const hoverParent = travelToNode(dragParent, hoverPath) ;
        const hoverNodeIndex = getNodeIndex(hoverPath);

        console.log( {dragPath}, {dragParent}, { hoverParent }, hoverNodeIndex);

        if (node.length > 0) {
            hoverParent.splice(hoverNodeIndex, 0, node[0]);
            console.log('final',hoverParent);
            setCards(copyCards);
        }

        // const dragCard = cards[dragIndex];
        // setCards(update(cards, {
        //     $splice: [
        //         [dragIndex, 1],
        //         [hoverIndex, 0, dragCard],
        //     ],
        // }));

    }, [cards]);

    const updateCard = useCallback((ob) => {
        const cardS = [...cards];
        cardS.splice(ob.index, 1, ob.node);
        cardS.splice(ob.pastIndex, 1);

        console.log("updated cards ", cardS);
        setCards(cardS);
    }, [cards]);

    const renderCard = (card, index) => {
        return (<Card key={card.id} path={`${index}`} item={card} updateCard={updateCard} moveCard={moveCard} />);
    };
    return (<>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
    </>);

};

export default Container;
