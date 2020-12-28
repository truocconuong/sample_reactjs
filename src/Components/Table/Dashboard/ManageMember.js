import React, { Component } from "react";
import { defaultAva, domainServer } from "../../../utils/config.js";


function ManageMember(props) {
 
  return (
    <div className="col-lg-4 plm_0 prm_0">
      <div className="card card-custom card-stretch gutter-b">
        <div className="card-header card-header-mobile border-0">
          <h3 className="card-title font-weight-bolder text-dark">
            Member Activities
          </h3>
          <div className="card-toolbar">
            <div className="dropdown dropdown-inline">
             
            </div>
          </div>
        </div>
        <div className="card-body pt-0">
          {props.role == "Member" ? (
            <div className="block_point">
              <img className="lock_role" src="/img/lock.jpg" />
            </div>
          ) : (
            <div className="wrap_manager_member">
              {props.data.map((user, index) => {
                return (
                  <div
                    key={index}
                    className={index === props.data.length ? "" : "mb-10"}
                  >
                    <div className="d-flex align-items-center">
                      <div className="symbol symbol-50 symbol-light mr-5">
                        <span className="symbol-label symbol-label-cs">
                          <img
                            src={
                              user.linkAvatar
                                ? domainServer + "/" + user.linkAvatar
                                : defaultAva
                            }
                            className="h-100 align-self-end"
                            alt=""
                          />
                        </span>
                      </div>
                      <div className="d-flex flex-column flex-grow-1">
                        <div
                          onClick={() =>
                            props.history.push(`/profile/${user.id}`)
                          }
                          style={{ cursor: "pointer" }}
                          className="font-weight-bold text-dark-75 text-hover-primary font-size-lg mb-1"
                        >
                          {user.name}
                        </div>
                        {user.lastLogin ? (
                          <span className="text-muted font-weight-bold">
                            Last login: {user.lastLogin}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageMember;
