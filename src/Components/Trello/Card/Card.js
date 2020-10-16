import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  MovableCardWrapper,
  CardHeader,
  CardRightContent,
  CardTitle,
  Detail,
  Footer,
} from "react-trello/dist/styles/Base";
import Tag from "./Tag";
import DeleteButton from "react-trello/dist/widgets/DeleteButton";

class Card extends Component {
  onDelete = (e) => {
    this.props.onDelete();
    e.stopPropagation();
  };

  render() {
    const {
      showDeleteButton,
      style,
      tagStyle,
      onClick,
      onDelete,
      className,
      id,
      title,
      label,
      description,
      email,
      phone,
      name,
      tags,
      cardDraggable,
    } = this.props;

    return (
      <MovableCardWrapper
        data-id={id}
        onClick={onClick}
        style={style}
        className={className}
      >
        <CardHeader>
          <CardTitle draggable={cardDraggable}>{title}</CardTitle>
          <CardRightContent>{label}</CardRightContent>
          {showDeleteButton && <DeleteButton onClick={this.onDelete} />}
        </CardHeader>
        <Detail>{description}</Detail>
        <Detail>name: {name}</Detail>
        <Detail>email: {email}</Detail>
        <Detail>phone: {phone}</Detail>
    
        {tags && tags.length > 0 && (
          <Footer>
            {tags.map((tag) => (
              <Tag key={tag.title} {...tag} tagStyle={tagStyle} />
            ))}
          </Footer>
        )}
      </MovableCardWrapper>
    );
  }
}

Card.propTypes = {
  showDeleteButton: PropTypes.bool,
  onDelete: PropTypes.func,
  onClick: PropTypes.func,
  style: PropTypes.object,
  tagStyle: PropTypes.object,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  phone: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
};

Card.defaultProps = {
  showDeleteButton: true,
  onDelete: () => {},
  onClick: () => {},
  style: {},
  tagStyle: {},
  title: "no title",
  description: "",
  email: "",
  phone: "",
  name:"",
  label: "",
  tags: [],
  className: "",
};

export default Card;
