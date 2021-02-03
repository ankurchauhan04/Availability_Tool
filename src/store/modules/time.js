const state = {
    weeks: [
        {
          time: {
            start: "09:00",
            end: "12:00",
          }
        },
        {
          time: {
            start: "09:00",
            end: "12:00",
          }
        },
        {
          time: {
            start: "09:00",
            end: "16:00",
          }
        },
        {
          time: {
            start: "09:00",
            end: "18:00",
          }
        },
        {
          time: {
            start: "09:00",
            end: "18:00",
          }
        },
        {
          time: {
            start: "12:00",
            end: "18:00",
          }
        },
        {
          time: {
            start: "10:00",
            end: "18:35",
          }
        },
      ],
};

const actions = {

};

const getters = {
    getData: (state) => {
        return state.weeks
    }
};

const mutations = {

};

export default {
    namespaced: true,
    state,
    actions,
    mutations,
    getters,
  };