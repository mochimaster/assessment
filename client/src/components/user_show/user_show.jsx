import { useContext, useEffect, useState } from 'react'

import { Form, Input, Button, Alert } from 'antd'
import styled from 'styled-components'
import { isEmpty } from 'lodash'

import { AppContext } from '../context'

import { createSession } from '../../util/user_api_util'
import { USER_ACTION } from '../app'

const StyledLoginContainer = styled.div`
  display: flex;
  justify-content: center;
  background-color: white;
  color: black;
`

export const UserShow = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  console.log('UserShow isLoggedIn: ', isLoggedIn)
  const [displayIncorrectLoginAlert, setDisplayIncorrectLoginAert] =
    useState(false)

  console.log('UserShow props: ', props)
  const { user, dispatchUserEvent } = useContext(AppContext)

  useEffect(() => {
    console.log('Use Effect user: ', user)
    if (isEmpty(user) && isLoggedIn) setIsLoggedIn(false)
  }, [user])
  console.log('useContext user: ', user)
  console.log('useContext dispatchUserEvent: ', dispatchUserEvent)

  const onFinish = async (values) => {
    const userResponse = await createSession(values)

    if (!isEmpty(userResponse)) {
      setIsLoggedIn(true)
      setDisplayIncorrectLoginAert(false)
      dispatchUserEvent(USER_ACTION.ADD_USER, userResponse)
    } else {
      setDisplayIncorrectLoginAert(true)
    }
  }

  //   const onFinishFailed = (errorInfo) => {
  //     console.log('Failed:', errorInfo)
  //   }

  const onCloseAlert = () => setDisplayIncorrectLoginAert(false)

  return (
    <StyledLoginContainer>
      {/* User show page */}
      {isLoggedIn && user && (
        <div>
          <div>Logged in as {user.name}</div>
          <div>Role: {user.role}</div>
          <Button onClick={() => dispatchUserEvent(USER_ACTION.REMOVE_USER)}>
            Log Out
          </Button>
        </div>
      )}
      {!isLoggedIn && (
        <>
          <Form
            name="basic"
            // labelCol={{
            //   span: 8
            // }}
            // wrapperCol={{
            //   span: 16
            // }}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ width: 500 }}
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: 'Please input your username!'
                }
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: 'Please input your password!'
                }
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 8,
                span: 16
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
            {displayIncorrectLoginAlert && (
              <Alert
                message="Combination of Username and Password not found"
                type="error"
                closable
                onClose={onCloseAlert}
              />
            )}
          </Form>
        </>
      )}
    </StyledLoginContainer>
  )
}
