export const initialStore=()=>{
  // Initialize auth from localStorage if available
  let token = null;
  let user = null;
  try {
    token = localStorage.getItem("token");
    const raw = localStorage.getItem("user");
    user = raw ? JSON.parse(raw) : null;
  } catch (e) {
    token = null;
    user = null;
  }

  return{
    message: null,
    auth: {
      token: token,
      user: user,
      isAuthenticated: !!token
    },
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
      
    case 'add_task':

      const { id,  color } = action.payload

      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    case 'set_auth':
      // payload: { token, user }
      try {
        if (action.payload && action.payload.token) {
          localStorage.setItem('token', action.payload.token);
        }
        if (action.payload && action.payload.user) {
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      } catch (e) {
        // ignore storage errors
      }
      return {
        ...store,
        auth: {
          token: action.payload?.token || null,
          user: action.payload?.user || null,
          isAuthenticated: !!(action.payload && action.payload.token)
        }
      };
    case 'logout':
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (e) {}
      return {
        ...store,
        auth: {
          token: null,
          user: null,
          isAuthenticated: false
        }
      };
    default:
      throw Error('Unknown action.');
  }    
}
