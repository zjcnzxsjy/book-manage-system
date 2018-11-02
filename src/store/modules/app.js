const app = {
    state: {
        visitedViews: []
    },
    mutations: {
        ADD_VISITED_VIEWS: (state, view) => {
            if (view) {
                if (state.visitedViews.some(v => v.path === view.path)) return;
                state.visitedViews.push({
                    name: view.name,
                    path: view.path
                });
            }
        },
        DEL_VISITED_VIEWS: (state, view) => {
            let index;
            for (const [i, v] of state.visitedViews.entries()) {
                if (v.path === view.path) {
                    index = i;
                    break;
                }
            }
            console.log(state.visitedViews, index);
            state.visitedViews.splice(index, 1);
        },
        DEL_OTHERS_VIEWS: (state, view) => {
            state.visitedViews = state.visitedViews.filter((visitedView, index) => {
                if (visitedView.name === view.name) {
                    return state.visitedViews.slice(index, index + 1);
                }
            })
        },
        DEL_ALL_VIEWS: (state) => {
            state.visitedViews = [];
        }
    },
    actions: {
        addVisitedViews: ({
            commit
        }, view) => {
            commit('ADD_VISITED_VIEWS', view);
        },
        delVisitedViews: ({
            commit,
            state
        }, view) => {
            return new Promise((resolve) => {
                commit('DEL_VISITED_VIEWS', view);
                console.log([...state.visitedViews]);
                resolve([...state.visitedViews]);
            })
        },
        delOthersViews: ({
            commit
        }, view) => {
            commit('DEL_OTHERS_VIEWS', view);
        },
        delAllViews: ({
            commit
        }) => {
            commit('DEL_ALL_VIEWS');
        }
    }
}

export default app;