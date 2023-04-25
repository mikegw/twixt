import { UserList } from "../components/userList";
import { UsernameList } from "../usernameList";
import { GlobalContext } from "../index";

let userList: UserList

export const JoinOrStart = () => {
  if (userList) return

  const userListElement = document.getElementById('users') as HTMLUListElement
  const usernames = new UsernameList(GlobalContext.dataStore)

  userList = new UserList(userListElement, usernames)
}
