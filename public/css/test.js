const container = document.querySelector('.container');


container.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = container;

    if (scrollTop + clientHeight >= scrollHeight) {
        console.log('Reached the bottom of the scrollable div!');

    }
});