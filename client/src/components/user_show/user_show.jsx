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

  const [displayIncorrectLoginAlert, setDisplayIncorrectLoginAert] =
    useState(false)

  const { user, dispatchUserEvent } = useContext(AppContext)

  useEffect(() => {
    if (isEmpty(user) && isLoggedIn) setIsLoggedIn(false)
  }, [user])

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

  const onCloseAlert = () => setDisplayIncorrectLoginAert(false)

  return (
    <StyledLoginContainer>
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
            onFinish={onFinish}
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
