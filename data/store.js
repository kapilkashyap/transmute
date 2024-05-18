export default {
    store: {
        books: [
            {
                category: 'reference',
                author: 'Nigel Rees',
                title: 'Sayings of the Century',
                price: 8.95
            },
            {
                category: 'fiction',
                author: 'Evelyn Waugh',
                title: 'Sword of Honour',
                price: 12.99
            },
            {
                category: 'fiction',
                author: 'Herman Melville',
                title: 'Moby Dick',
                isbn: '0-553-21311-3',
                price: 8.99
            },
            {
                category: 'fiction',
                author: 'J. R. R. Tolkien',
                title: 'The Lord of the Rings',
                isbn: '0-395-19395-8',
                price: 22.99,
                discount: '10%',
                discountPrice: 20.7
            }
        ],
        bicycles: [
            {
                type: 'MTB',
                color: 'red',
                gears: 5,
                breaks: {
                    front: 'disk',
                    rear: 'disk'
                },
                headlight: true,
                price: 199.95
            },
            {
                type: 'ATB',
                color: 'blue',
                gears: 7,
                breaks: {
                    front: 'disk',
                    rear: 'disk'
                },
                price: 299.95
            }
        ]
    }
};
