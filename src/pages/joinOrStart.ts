import { UserList } from "../components/userList";
import { UsernameList } from "../usernameList";
import { dataStore } from "../dataStore/firebase";
import { GlobalContext } from "../index";

export function JoinOrStart() {
  const userListElement = document.getElementById('users') as HTMLUListElement
  const usernames = new UsernameList(GlobalContext.dataStore)

  new UserList(userListElement, usernames)
}
