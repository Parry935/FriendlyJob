using api_server.Exceptions;
using api_server.Interfaces.Services;
using api_server.Models.DTOs;
using api_server.Models.DTOs.CreateDTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api_server.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessagesService _messageService;

        public MessagesController(IMessagesService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet("conversations")]
        public async Task<ActionResult<IEnumerable<ConversationDto>>> GetConversations([FromQuery] int Page)
        {
            var conversations = await _messageService.GetConversationsAsync(Page);

            return Ok(conversations);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessages([FromQuery] int? Sender, [FromQuery] int? Recipient)
        {
            var conversationDetails = await _messageService.GetMessagesAsync(Sender, Recipient);

            return Ok(conversationDetails);
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage([FromBody] CreateMessageDto createMessageDto)
        {
            var createdMessage = await _messageService.CreateMessageAsync(createMessageDto);

            return Ok(createdMessage);
        }

        [HttpPatch("{id:int}")]
        public async Task<ActionResult> EditMessage([FromRoute] int id, [FromBody] CreateMessageDto updateMessageDto)
        {
            await _messageService.EditMessageAsync(id, updateMessageDto.Content);

            return Ok();
        }

        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteMessage([FromRoute] int id)
        {
            await _messageService.DeleteMessageAsync(id);

            return NoContent();
        }
    }
}
