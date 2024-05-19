import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './Home/Home';
import { Login } from './Login/Login';
import { Signup } from './Signup/Signup';
import { ATMLogin } from './ATM/ATMLogin';
import {MGMTLogin} from './Management/mgmtLogin'
import { ATM } from './Bank/ATM'
import { Deposit } from './Bank/Deposit';
import { Bank } from './Bank/Bank';
import { Transaction } from './Bank/Transaction';
import { Transfer } from './Transfer/Transfer';
import {Success} from './Transfer/Success'
import { CloseAccount } from './CloseUser/CloseUser';
import  CreateAccount from './Bank/CreateAccount';
import MGMTCreateAccount from './Management/MGMTCreateAccount';
import AccountsList from './Bank/Accounts';
import {UserTable} from './Management/managementHome';
import {MGMTUserAccounts} from "./Management/UserReportPage";


function App() {
  const [users, setUsers] = useState([
    { username: "jones", password: "1234" },
    { username: "frank", password: "123" },
  ]);

  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login users={users} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ATMLogin" element={<ATMLogin users={users}  />} />
        <Route path = "/MGMTLogin" element = {<MGMTLogin users = {users}/>}/>
        <Route path="/ATM" element={<ATM />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/bank" element={<Bank />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/Transfer" element={<Transfer users={users} />} />
        <Route path="/Success" element={<Success />} />
        <Route path="/close-account" element={<CloseAccount />} />
        <Route path="/user-accounts" element={<AccountsList />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path = "/mgmt-create-account/:accountNumber" element = {<MGMTCreateAccount />}/>
        <Route path="/user-table" element={<UserTable />} />
        <Route path="/user-account/:accountNumber" element={<MGMTUserAccounts />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;